const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance");
const { isLoggedIn } = require("../middleware");

router.get("/report", isLoggedIn, attendanceController.renderAttendanceReport);
router.get("/view/:classId/:date", isLoggedIn, attendanceController.viewClassAttendance);
router.get("/select-class", isLoggedIn, attendanceController.renderClassSelect);
router.get("/mark/:classId", isLoggedIn, attendanceController.renderMarkAttendance);
router.post("/mark/:classId", isLoggedIn, attendanceController.markAttendance);

module.exports = router;
