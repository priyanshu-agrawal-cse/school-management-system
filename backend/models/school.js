// const { ref } = require("joi");
const mongoose = require("mongoose");
// const Review = require("./review.js");

const schoolSchema = mongoose.Schema({
    phoneNumber : Number,
    name : String,
    upiId : String,
   hostelFee: Number,
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
 classId : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Classes",
    },],
    
   
});

// this i sthe middle ware of mongoose us eto delte the reviews when the listing is deleted


const School = mongoose.model("School",schoolSchema);
module.exports = School ;