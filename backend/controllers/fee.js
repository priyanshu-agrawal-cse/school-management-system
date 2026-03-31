const Transaction = require("../models/transaction");
const School = require("../models/school");
const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");

module.exports.renderFees = async (req, res) => {
    try {
        const schoolId = req.user._id;
        const school = await School.findOne({ user: schoolId }).populate("classId");
        if (!school) return res.status(404).send("School not found");

        const transactions = await Transaction.find({ schoolId: school._id })
            .populate({
                path: "studentId",
                populate: { path: "classId", model: "Classes" }
            });

        res.status(200).json({ transactions, school });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

module.exports.uploadTransaction = async (req, res) => {
    try {
        const { studentId, schoolId, amount } = req.params;
        if (!req.file?.buffer) return res.status(400).send("No file uploaded");

        const { data: { text } } = await Tesseract.recognize(req.file.buffer, "eng");
        const utrMatch = text.match(/\b\d{10,12}\b/);
        const txnMatch = text.match(/\b\d{6,10}\b/);
        const transactionId = utrMatch?.[0] || txnMatch?.[0];

        if (!transactionId) return res.status(400).send("Could not extract Transaction number");

        const newTxn = new Transaction({ UTR: transactionId, studentId, schoolId, amount, status: "Pending" });
        await newTxn.save();
        res.status(200).json({ redirectUrl: `/studentFeedetails/${studentId}` });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

module.exports.verifyBankStatement = async (req, res) => {
    try {
        if (!req.file?.buffer) return res.status(400).send("No statement uploaded");
        const pdfData = await pdfParse(req.file.buffer);
        const utrs = pdfData.text.match(/\b\d{10,12}\b/g);
        if (!utrs) return res.status(400).send("No transaction IDs found");

        const uniqueUTRs = [...new Set(utrs.map(Number))];
        await Transaction.updateMany({ UTR: { $in: uniqueUTRs } }, { $set: { status: "Approved" } });
        res.status(200).json({ redirectUrl: "/fees" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};
