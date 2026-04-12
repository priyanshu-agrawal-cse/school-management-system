const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacher");
const { isLoggedIn } = require("../middleware");

router.get("/teachers", isLoggedIn, teacherController.viewTeachers);
router.route("/teachers/add")
    .get(isLoggedIn, teacherController.renderAddForm)
    .post(isLoggedIn, teacherController.addTeacher);

router.get("/:id/qrcode.png", teacherController.renderQRCode);
router.get("/portal/:id", teacherController.renderPortal);
router.post("/add-homework/:teacherId", teacherController.addHomework);
router.post("/mark-attendance/:classId", teacherController.markAttendance);
router.post("/upload-marks/:classId", teacherController.uploadMarks);

module.exports = router;
