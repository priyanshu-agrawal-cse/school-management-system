const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const examSchema = new Schema({
    name: {
        type: String, // e.g. "Term 1", "Final Exam"
        required: true
    },
    classId: {
        type: Schema.Types.ObjectId,
        ref: "Classes",
        required: true
    },
    schoolId: {
        type: Schema.Types.ObjectId,
        ref: "School",
        required: true
    },
    date: {
        type: Date,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Exam", examSchema);
