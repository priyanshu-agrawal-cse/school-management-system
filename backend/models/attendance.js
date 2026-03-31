const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    classId: {
        type: Schema.Types.ObjectId,
        ref: "Classes",
        required: true
    },
    status: {
        type: String,
        enum: ["Present", "Absent", "Leave"],
        default: "Present"
    },
    date: {
        type: Date,
        default: Date.now
    },
    schoolId: {
        type: Schema.Types.ObjectId,
        ref: "School"
    }
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
