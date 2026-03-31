const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance");
const { isLoggedIn } = require("../middleware");

// Admin can see all class attendance
router.get("/attendance/report", isLoggedIn, attendanceController.renderAttendanceReport);
router.get("/attendance/view/:classId/:date", isLoggedIn, attendanceController.viewClassAttendance);

// Attendance marking (Public link for teachers from portal, or Admin)
router.get("/attendance", isLoggedIn, attendanceController.renderClassSelect);
router.get("/attendance/mark/:classId", attendanceController.renderMarkAttendance);
router.post("/attendance/mark/:classId", attendanceController.markAttendance);

module.exports = router;
