const express = require("express");
const router = express.Router();
const noticeController = require("../controllers/notice");
const { isLoggedIn } = require("../middleware");

router.get("/notices", isLoggedIn, noticeController.viewNotices);
router.route("/notices/add")
    .get(isLoggedIn, noticeController.renderAddForm)
    .post(isLoggedIn, noticeController.addNotice);

module.exports = router;
