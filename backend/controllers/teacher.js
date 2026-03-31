const Teacher = require("../models/teacher");
const School = require("../models/school");
const Student = require("../models/student");
const Homework = require("../models/homework");
const QRCode = require("qrcode");
const { getLocalIP } = require("../utils/network");

module.exports.renderAddForm = async (req, res) => {
    const school = await School.findOne({ user: req.user._id }).populate("classId");
    res.status(200).json({ classes: school.classId });
};

module.exports.addTeacher = async (req, res) => {
    const school = await School.findOne({ user: req.user._id });
    const newTeacher = new Teacher({
        ...req.body,
        subjects: req.body.subjects.split(","),
        schoolId: school._id
    });
    await newTeacher.save();
    res.status(200).json({ redirectUrl: "/dashboard" });
};

module.exports.viewTeachers = async (req, res) => {
    const school = await School.findOne({ user: req.user._id });
    if (!school) return res.send("School not found");
    const teachers = await Teacher.find({ schoolId: school._id }).populate("classId");
    res.status(200).json({ teachers });
};

module.exports.renderQRCode = async (req, res) => {
    const localIP = getLocalIP();
    const url = `http://${localIP}:8080/teacher/portal/${req.params.id}`;
    const qr = await QRCode.toBuffer(url, { type: "png", width: 300 });
    res.type("png");
    res.send(qr);
};

module.exports.renderPortal = async (req, res) => {
    const teacher = await Teacher.findById(req.params.id).populate("classId").populate("schoolId");
    if (!teacher) return res.send("Teacher not found");
    const students = await Student.find({ classId: teacher.classId._id });
    const school = await School.findById(teacher.schoolId).populate("classId");
    const homeworks = await Homework.find({ teacherId: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json({ teacher, students, homeworks, classes: school.classId });
};

module.exports.addHomework = async (req, res) => {
    const teacher = await Teacher.findById(req.params.teacherId);
    const newHomework = new Homework({
        ...req.body,
        teacherId: req.params.teacherId,
        schoolId: teacher.schoolId
    });
    await newHomework.save();
    res.status(200).json({ redirectUrl: `/teacher/portal/${req.params.teacherId}` });
};
