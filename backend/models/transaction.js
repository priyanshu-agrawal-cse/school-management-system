// const { ref } = require("joi");
const mongoose = require("mongoose");
// const Review = require("./review.js");

const transactionSchema = mongoose.Schema({
    UTR : Number,
    studentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Student",
    },
    schoolId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "School",
    },
    date :{
    type: Date,
    default: Date.now(),
},
status : String,
amount : Number,
   
});

// this i sthe middle ware of mongoose us eto delte the reviews when the listing is deleted


const Transaction = mongoose.model("Transaction",transactionSchema);
module.exports = Transaction ;