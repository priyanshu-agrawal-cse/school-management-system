// const { ref } = require("joi");
const mongoose = require("mongoose");
// const Review = require("./review.js");

const studentSchema = mongoose.Schema({
    name : String,
    father_name : String,
    phoneNumber : Number,
   rollNumber : Number,
   hostel: String,
    classId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Classes",
    }
   
});

// this i sthe middle ware of mongoose us eto delte the reviews when the listing is deleted


const Student = mongoose.model("Student",studentSchema);
module.exports = Student ;