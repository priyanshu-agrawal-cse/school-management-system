const Student = require("../models/student");
const School = require("../models/school");
const Homework = require("../models/homework");
const Transaction = require("../models/transaction");
const Attendance = require("../models/attendance");
const QRCode = require("qrcode");

module.exports.renderAddForm = async (req, res) => {
    try {
        const schoolId = req.user._id;
        const school = await School.findOne({ user: schoolId }).populate("classId");
        if (!school) return res.status(404).send("School not found");
        res.status(200).json({ school });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

module.exports.addStudent = async (req, res) => {
    try {
        const { name, father_name, phoneNumber, rollNumber, hostel, classId } = req.body;
        const studentsToInsert = [];
        if (Array.isArray(name)) {
            for (let i = 0; i < name.length; i++) {
                studentsToInsert.push({
                    name: name[i], father_name: father_name[i], phoneNumber: phoneNumber[i],
                    rollNumber: rollNumber[i], hostel: hostel[i], classId: classId[i],
                });
            }
        } else {
            studentsToInsert.push({ name, father_name, phoneNumber, rollNumber, hostel, classId });
        }
        await Student.insertMany(studentsToInsert);
        res.status(200).json({ redirectUrl: "/viewStudent" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error while adding students");
    }
};

module.exports.viewStudents = async (req, res) => {
    try {
        const schoolUserId = req.user._id;
        const { search, classId, year } = req.query;
        const school = await School.findOne({ user: schoolUserId }).populate("classId");
        if (!school) return res.status(404).send("School not found");
        const classIds = school.classId.map(cls => cls._id);

        let filter = { classId: { $in: classIds } };
        if (search?.trim()) filter.name = { $regex: search.trim(), $options: "i" };
        if (classId && classIds.some(id => id.toString() === classId)) filter.classId = classId;
        if (year) filter.year = year;

        const students = await Student.find(filter).populate("classId").sort({ rollNumber: 1 });
        res.status(200).json({ student: students, classes: school.classId, query: req.query });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

module.exports.renderProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate("classId");
        if (!student) return res.status(404).send("Student not found");
        res.status(200).json({ student });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

module.exports.renderQRCode = async (req, res) => {
    try {
        const studentId = req.params.id;
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const targetUrl = `${frontendUrl}/studentFeedetails/${studentId}`;
        const qrBuffer = await QRCode.toBuffer(targetUrl, { type: "png", width: 300, errorCorrectionLevel: "H" });
        res.type("png");
        res.send(qrBuffer);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error generating QR code");
    }
};

module.exports.renderFeeDetails = async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await Student.findById(studentId).populate("classId");
        if (!student) return res.status(404).send("Student not found");
        const school = await School.findOne({ classId: student.classId._id });
        const transaction = await Transaction.find({ studentId: student._id });
        const homeworks = await Homework.find({ classId: student.classId._id }).populate("teacherId").sort({ createdAt: -1 });
        const attendances = await Attendance.find({ studentId: student._id }).sort({ date: -1 });
        res.status(200).json({ student, school, transaction, homeworks, attendances });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};
