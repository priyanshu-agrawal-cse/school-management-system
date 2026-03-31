const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noticeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    schoolId: {
        type: Schema.Types.ObjectId,
        ref: "School"
    },
    target: {
        type: String,
        enum: ["All", "Students", "Teachers"],
        default: "All"
    }
}, { timestamps: true });

module.exports = mongoose.model("Notice", noticeSchema);
