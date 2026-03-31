const express = require("express");
const router = express.Router();
const examController = require("../controllers/exam");
const { isLoggedIn } = require("../middleware");

router.get("/exams", isLoggedIn, examController.renderExams);
router.route("/exams/add")
    .get(isLoggedIn, examController.renderAddForm)
    .post(isLoggedIn, examController.addExam);

router.route("/exams/marks/:id")
    .get(isLoggedIn, examController.renderAddMarksForm)
    .post(isLoggedIn, examController.addMarks);

module.exports = router;
