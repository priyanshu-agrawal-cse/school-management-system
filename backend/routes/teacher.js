const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacher");
const { isLoggedIn } = require("../middleware");

router.get("/teachers", isLoggedIn, teacherController.viewTeachers);
router.route("/teachers/add")
    .get(isLoggedIn, teacherController.renderAddForm)
    .post(isLoggedIn, teacherController.addTeacher);

router.get("/teacher/:id/qrcode.png", teacherController.renderQRCode);
router.get("/teacher/portal/:id", teacherController.renderPortal);
router.post("/teacher/add-homework/:teacherId", teacherController.addHomework);

module.exports = router;
