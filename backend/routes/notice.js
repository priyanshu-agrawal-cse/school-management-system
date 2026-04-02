const express = require("express");
const router = express.Router();
const noticeController = require("../controllers/notice");
const { isLoggedIn } = require("../middleware");

router.get("/viewNotices", isLoggedIn, noticeController.viewNotices);
router.post("/addNotice", isLoggedIn, noticeController.addNotice);

module.exports = router;
