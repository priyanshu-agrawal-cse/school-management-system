const express = require("express");
const router = express.Router();
const feeController = require("../controllers/fee");
const { isLoggedIn } = require("../middleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.get("/fees", isLoggedIn, feeController.renderFees);
router.post("/upload-transaction/:studentId/:schoolId/:amount", upload.single("transactionImage"), feeController.uploadTransaction);
router.post("/verify-statement", isLoggedIn, upload.single("statement"), feeController.verifyBankStatement);

module.exports = router;
