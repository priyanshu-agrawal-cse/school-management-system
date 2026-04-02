const express = require("express");
const router = express.Router();
const examController = require("../controllers/exam");
const { isLoggedIn } = require("../middleware");

router.route("/exams")
    .get(isLoggedIn, examController.renderExams)
    .post(isLoggedIn, examController.addExam);
router.get("/exams/add", isLoggedIn, examController.renderAddForm);
router.route("/exam/:id/marks")
    .get(isLoggedIn, examController.renderAddMarksForm)
    .post(isLoggedIn, examController.addMarks);

module.exports = router;
