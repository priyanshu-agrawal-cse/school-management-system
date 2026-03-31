const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/auth");

router.post("/signup", authController.signup);

router.post(
    "/login",
    passport.authenticate("local", { session: false }),
    authController.login
);

router.post("/logout", authController.logout);

module.exports = router;
