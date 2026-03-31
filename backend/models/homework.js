const mongoose = require("mongoose");

const homeworkSchema = new mongoose.Schema({

    /* Homework text */

    homework: {
        type: String,
        required: true
    },

    /* Which teacher assigned */

    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
    },

    /* Which class */

    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classes",
        required: true
    },

    /* School (IMPORTANT for filtering) */

    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true
    },

    /* Subject (optional but useful) */

    subject: {
        type: String
    },

    /* Due date */

    dueDate: {
        type: Date
    },

    /* Created at */

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Homework", homeworkSchema);