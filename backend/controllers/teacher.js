const Teacher = require("../models/teacher");
const School = require("../models/school");
const Student = require("../models/student");
const Homework = require("../models/homework");
const Attendance = require("../models/attendance");
const Exam = require("../models/exam");
const Result = require("../models/result");
const QRCode = require("qrcode");

module.exports.renderAddForm = async (req, res) => {
    const school = await School.findOne({ user: req.user._id }).populate("classId");
    res.status(200).json({ classes: school.classId });
};

module.exports.addTeacher = async (req, res) => {
    try {
        const school = await School.findOne({ user: req.user._id });
        if (!school) return res.status(404).json({ error: "School not found" });

        const { name, phoneNumber, email, address, salary, subjects, classId } = req.body;
        
        let processedSubjects = [];
        if (Array.isArray(subjects)) {
            processedSubjects = subjects;
        } else if (typeof subjects === 'string') {
            processedSubjects = subjects.split(",").map(s => s.trim());
        }

        const newTeacher = new Teacher({
            name,
            phoneNumber,
            email,
            address,
            salary,
            subjects: processedSubjects,
            classId: classId || null,
            schoolId: school._id
        });

        await newTeacher.save();
        res.status(200).json({ message: "Teacher added successfully", redirectUrl: "/teachers" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add teacher" });
    }
};

module.exports.viewTeachers = async (req, res) => {
    const school = await School.findOne({ user: req.user._id });
    if (!school) return res.send("School not found");
    const teachers = await Teacher.find({ schoolId: school._id }).populate("classId");
    res.status(200).json({ teachers });
};

module.exports.renderQRCode = async (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const url = `${frontendUrl}/teacher/portal/${req.params.id}`;
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
        schoolId: teacher.schoolId,
        classId: req.body.classId || teacher.classId
    });
    await newHomework.save();
    res.status(200).json({ redirectUrl: `/teacher/portal/${req.params.teacherId}` });
};

module.exports.markAttendance = async (req, res) => {
    try {
        const { classId } = req.params;
        const { attendance } = req.body;
        const school = await School.findOne({ classId: classId });
        if (!school) return res.status(404).send("School not found for this class");

        const date = new Date();
        date.setHours(0,0,0,0);
        await Attendance.deleteMany({ classId, date });

        if (attendance) {
            const attendances = Object.keys(attendance).map(studentId => ({
                studentId,
                classId,
                schoolId: school._id,
                status: attendance[studentId],
                date
            }));
            await Attendance.insertMany(attendances);
        }
        res.status(200).json({ message: "Attendance marked successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error marking attendance");
    }
};

module.exports.uploadMarks = async (req, res) => {
    try {
        const { classId } = req.params;
        const { examName, subject, marks, date } = req.body; // marks is { studentId: marksObtained }

        const school = await School.findOne({ classId: classId });
        if (!school) return res.status(404).send("School not found");

        let exam = await Exam.findOne({ name: examName, classId: classId, schoolId: school._id });
        if (!exam) {
            exam = new Exam({ name: examName, classId: classId, schoolId: school._id, date: date || new Date() });
            await exam.save();
        }

        const resultData = [];
        for (let studentId in marks) {
            resultData.push({
                studentId,
                examId: exam._id,
                subject,
                marksObtained: marks[studentId]
            });
        }
        
        await Result.deleteMany({ examId: exam._id, subject, studentId: { $in: Object.keys(marks) } });
        await Result.insertMany(resultData);
        
        res.status(200).json({ message: "Marks uploaded successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error uploading marks");
    }
};
