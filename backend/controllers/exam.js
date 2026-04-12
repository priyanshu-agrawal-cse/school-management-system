const Exam = require("../models/exam");
const Result = require("../models/result");
const Student = require("../models/student");
const School = require("../models/school");

module.exports.renderExams = async (req, res) => {
    const school = await School.findOne({ user: req.user._id }).populate("classId");
    const exams = await Exam.find({ schoolId: school._id }).populate("classId");
    res.status(200).json({ exams });
};

module.exports.renderAddForm = async (req, res) => {
    const school = await School.findOne({ user: req.user._id }).populate("classId");
    res.status(200).json({ classes: school.classId });
};

module.exports.addExam = async (req, res) => {
    const school = await School.findOne({ user: req.user._id });
    const newExam = new Exam({
        ...req.body,
        schoolId: school._id
    });
    await newExam.save();
    res.status(200).json({ redirectUrl: "/exams" });
};

module.exports.renderAddMarksForm = async (req, res) => {
    const exam = await Exam.findById(req.params.id).populate("classId");
    const students = await Student.find({ classId: exam.classId._id }).sort({ rollNumber: 1 });
    const results = await Result.find({ examId: exam._id });
    res.status(200).json({ exam, students, results });
};

module.exports.addMarks = async (req, res) => {
    const { marks } = req.body; // { studentId: { subject: marks } }
    const examId = req.params.id;

    const resultData = [];
    for (let studentId in marks) {
        for (let subject in marks[studentId]) {
            resultData.push({
                studentId,
                examId,
                subject,
                marksObtained: marks[studentId][subject]
            });
        }
    }

    await Result.insertMany(resultData);
    res.status(200).json({ redirectUrl: "/exams" });
};
