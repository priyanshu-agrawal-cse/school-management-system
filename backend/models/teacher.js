const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: Number,
        required: true
    },

    email: {
        type: String
    },

    address: {
        type: String
    },

    salary: {
        type: Number,
        required: true
    },

    subjects: [
        {
            type: String
        }
    ],

    /* Which class teacher handles */

    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classes"
    },

    /* School reference (IMPORTANT) */

    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true
    },

    joiningDate: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Teacher", teacherSchema);