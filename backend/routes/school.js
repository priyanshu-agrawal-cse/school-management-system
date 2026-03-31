const express = require("express");
const router = express.Router();
const schoolController = require("../controllers/school");
const { isLoggedIn } = require("../middleware");

router.route("/schoolRegistration")
    .get(isLoggedIn, schoolController.renderRegistrationForm)
    .post(isLoggedIn, schoolController.registerSchool);

router.get("/dashboard", isLoggedIn, schoolController.renderDashboard);

router.get("/account", isLoggedIn, schoolController.renderAccount);
router.post("/save-upi-details", isLoggedIn, schoolController.updateUpi);

router.route("/classes/add")
    .get(isLoggedIn, schoolController.renderAddClassesForm)
    .post(isLoggedIn, schoolController.addClasses);

module.exports = router;
