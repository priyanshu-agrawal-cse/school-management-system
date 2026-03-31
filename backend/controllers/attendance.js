const Student = require("../models/student");
const School = require("../models/school");
const Attendance = require("../models/attendance");
const Classes = require("../models/classes");

module.exports.renderClassSelect = async (req, res) => {
    const school = await School.findOne({ user: req.user._id }).populate("classId");
    res.status(200).json({ classes: school.classId });
};

module.exports.renderMarkAttendance = async (req, res) => {
    const classId = req.params.classId;
    const students = await Student.find({ classId }).sort({ rollNumber: 1 });
    // Pass teacherId if present in query for context (optional but helpful)
    const teacherId = req.query.teacherId || null;
    res.status(200).json({ students, classId, teacherId });
};

module.exports.markAttendance = async (req, res) => {
    try {
        const { classId } = req.params;
        const { attendance } = req.body; // { studentId: status }
        
        // Find school by looking up which school contains this classId
        const school = await School.findOne({ classId: classId });
        if (!school) return res.status(404).send("School not found for this class");

        const date = new Date();
        date.setHours(0,0,0,0);

        // Remove existing attendance for this class and date to prevent duplicates
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

        // Redirect based on who is marking (Admin vs Teacher)
        if (req.user) {
            res.status(200).json({ redirectUrl: "/attendance/report" });
        } else {
            // Probably a teacher from the portal
            res.send("Attendance marked successfully! <a href='javascript:history.back()'>Go Back</a>");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error marking attendance");
    }
};

module.exports.renderAttendanceReport = async (req, res) => {
    try {
        const school = await School.findOne({ user: req.user._id }).populate("classId");
        if (!school) return res.status(200).json({ redirectUrl: "/login" });

        const classIds = school.classId.map(c => c._id);
        
        // Aggregate attendance counts by class and date
        const report = await Attendance.aggregate([
            { $match: { classId: { $in: classIds } } },
            {
                $group: {
                    _id: { 
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        classId: "$classId"
                    },
                    present: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
                    absent: { $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] } },
                    leave: { $sum: { $cond: [{ $eq: ["$status", "Leave"] }, 1, 0] } }
                }
            },
            {
                $lookup: {
                    from: "classes",
                    localField: "_id.classId",
                    foreignField: "_id",
                    as: "classDetails"
                }
            },
            { $unwind: "$classDetails" },
            { $sort: { "_id.date": -1, "classDetails.class": 1 } }
        ]);

        res.status(200).json({ report, school });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error generating attendance report");
    }
};

module.exports.viewClassAttendance = async (req, res) => {
    const { classId, date } = req.params;
    const searchDate = new Date(date);
    searchDate.setHours(0,0,0,0);

    const attendances = await Attendance.find({ classId, date: searchDate })
        .populate("studentId")
        .sort({ "studentId.rollNumber": 1 });
    
    const classDetail = await Classes.findById(classId);

    res.status(200).json({ attendances, date, classDetail });
};
