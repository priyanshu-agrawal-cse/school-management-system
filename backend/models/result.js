const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resultSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    examId: {
        type: Schema.Types.ObjectId,
        ref: "Exam",
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    marksObtained: {
        type: Number,
        required: true
    },
    maxMarks: {
        type: Number,
        default: 100
    }
}, { timestamps: true });

module.exports = mongoose.model("Result", resultSchema);
