const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student");
const { isLoggedIn } = require("../middleware");

router.get("/viewStudent", isLoggedIn, studentController.viewStudents);

router.route("/addStudent")
    .get(isLoggedIn, studentController.renderAddForm)
    .post(isLoggedIn, studentController.addStudent);

router.get("/student/:id", studentController.renderProfile);
router.get("/student/:id/qrcode.png", studentController.renderQRCode);
router.get("/studentFeedetails/:id", studentController.renderFeeDetails);

module.exports = router;
