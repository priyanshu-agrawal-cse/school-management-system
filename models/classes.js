// const { ref } = require("joi");
const mongoose = require("mongoose");
// const Review = require("./review.js");

const classesSchema = mongoose.Schema({
    class : String,
    section: String,
   acadmicFee: Number,
});

// this i sthe middle ware of mongoose us eto delte the reviews when the listing is deleted


const Classes = mongoose.model("Classes",classesSchema);
module.exports = Classes ;