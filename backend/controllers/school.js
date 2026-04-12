const School = require("../models/school");
const Classes = require("../models/classes");
const Student = require("../models/student");
const Transaction = require("../models/transaction");

module.exports.renderRegistrationForm = (req, res) => {
    res.status(200).json({ view: "school/schoolRegistrationFrom.ejs" });
};

module.exports.registerSchool = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, phoneNumber, upiId, hostelFee } = req.body;
        const rawClasses = req.body.classId;

        let formattedClasses = [];
        if (rawClasses && rawClasses.class) {
            if (Array.isArray(rawClasses.class)) {
                for (let i = 0; i < rawClasses.class.length; i++) {
                    if (rawClasses.class[i]) {
                        formattedClasses.push({
                            class: rawClasses.class[i],
                            section: rawClasses.section[i] || '',
                            acadmicFee: rawClasses.acadmicFee[i] || 0,
                        });
                    }
                }
            } else {
                formattedClasses.push({
                    class: rawClasses.class,
                    section: rawClasses.section || '',
                    acadmicFee: rawClasses.acadmicFee || 0,
                });
            }
        }

        const createdClasses = formattedClasses.length > 0 
            ? await Classes.insertMany(formattedClasses) 
            : [];

        const school = new School({
            name,
            phoneNumber,
            upiId,
            hostelFee,
            user: userId,
            classId: createdClasses.map(c => c._id),
        });

        await school.save();
        res.status(200).json({ redirectUrl: "/dashboard", school });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error registering school" });
    }
};

module.exports.renderDashboard = async (req, res) => {
    const school = await School.findOne({ user: req.user._id }).populate("classId");
    if (!school) return res.send("School not found");

    const classIds = school.classId.map(c => c._id);

    // TOTAL STUDENTS
    const totalStudents = await Student.countDocuments({ classId: { $in: classIds } });

    // TOTAL TRANSACTIONS (using length of aggregation for now as per original code)
    const totalTransactions = await Transaction.aggregate([
        { $lookup: { from: "students", localField: "studentId", foreignField: "_id", as: "student" } },
        { $unwind: "$student" },
        { $match: { "student.classId": { $in: classIds } } }
    ]);

    // MONTHLY FEES
    const start = new Date();
    start.setDate(1); start.setHours(0, 0, 0, 0);
    const end = new Date(start); end.setMonth(end.getMonth() + 1);

    const monthlyFees = await Transaction.aggregate([
        { $lookup: { from: "students", localField: "studentId", foreignField: "_id", as: "student" } },
        { $unwind: "$student" },
        { $match: { "student.classId": { $in: classIds }, status: "Approved", date: { $gte: start, $lt: end } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalFees = monthlyFees[0]?.total || 0;

    // PIE CHART DATA
    const paidCount = await Transaction.aggregate([
        { $lookup: { from: "students", localField: "studentId", foreignField: "_id", as: "student" } },
        { $unwind: "$student" },
        { $match: { "student.classId": { $in: classIds }, status: "Approved" } }
    ]);
    const pendingCount = await Transaction.aggregate([
        { $lookup: { from: "students", localField: "studentId", foreignField: "_id", as: "student" } },
        { $unwind: "$student" },
        { $match: { "student.classId": { $in: classIds }, status: { $ne: "Approved" } } }
    ]);

    // BAR GRAPH DATA
    const monthlyData = await Transaction.aggregate([
        { $lookup: { from: "students", localField: "studentId", foreignField: "_id", as: "student" } },
        { $unwind: "$student" },
        { $match: { "student.classId": { $in: classIds }, status: "Approved" } },
        { $group: { _id: { $month: "$date" }, total: { $sum: "$amount" } } }
    ]);

    let monthlyGraph = new Array(12).fill(0);
    monthlyData.forEach(m => { monthlyGraph[m._id - 1] = m.total; });

    res.status(200).json({
        totalStudents,
        totalTransactions: totalTransactions.length,
        totalFees,
        paidCount: paidCount.length,
        pendingCount: pendingCount.length,
        monthlyGraph
    });
};

module.exports.renderAccount = async (req, res) => {
    const schoolId = req.user._id;
    const school = await School.findOne({ user: schoolId }).populate("classId");
    res.status(200).json({ school });
};

module.exports.updateUpi = async (req, res) => {
    try {
        const { transactionId } = req.body;
        const school = await School.findOne({ user: req.user._id });
        if (!school) return res.status(404).send('School not found');
        school.upiId = transactionId;
        await school.save();
        res.status(200).json({ redirectUrl: '/account' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports.renderAddClassesForm = async (req, res) => {
    const school = await School.findOne({ user: req.user._id });
    if (!school) return res.status(200).json({ redirectUrl: "/schoolRegistration" });
    res.status(200).json({ view: "student/addClasses.ejs" });
};

module.exports.addClasses = async (req, res) => {
    try {
        const school = await School.findOne({ user: req.user._id });
        if (!school) {
            return res.status(404).json({ error: "School not found. Please register your school first." });
        }

        const raw = req.body.classId;
        if (!raw || (!raw.class && !Array.isArray(raw.class))) {
            return res.status(400).json({ error: "No classes provided" });
        }

        let classesToCreate = [];
        if (Array.isArray(raw.class)) {
            for (let i = 0; i < raw.class.length; i++) {
                if (raw.class[i]) {
                    classesToCreate.push({
                        class: raw.class[i],
                        section: raw.section[i] || '',
                        acadmicFee: raw.acadmicFee[i] || 0,
                    });
                }
            }
        } else if (raw.class) {
            classesToCreate.push({
                class: raw.class,
                section: raw.section || '',
                acadmicFee: raw.acadmicFee || 0,
            });
        }

        if (classesToCreate.length === 0) {
            return res.status(400).json({ error: "No valid classes provided" });
        }

        const createdClasses = await Classes.insertMany(classesToCreate);
        await School.findByIdAndUpdate(school._id, { $push: { classId: { $each: createdClasses.map(c => c._id) } } });
        
        res.status(200).json({ message: "Classes added successfully", redirectUrl: "/fees" });
    } catch (err) {
        console.error("Error in addClasses:", err);
        res.status(500).json({ error: "Failed to add classes" });
    }
};

module.exports.getRegistrationStatus = async (req, res) => {
    try {
        const school = await School.findOne({ user: req.user._id });
        res.status(200).json({ registered: !!school, schoolId: school?._id });
    } catch (err) {
        res.status(500).json({ error: "Failed to check registration status" });
    }
};
