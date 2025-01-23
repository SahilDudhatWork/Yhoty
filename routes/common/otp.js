const { Router } = require("express");
const router = Router();

const { sentOtp } = require("../../controllers/common/otp/sentOtp");
const { verifyOtp } = require("../../controllers/common/otp/verifyOtp");

router.post("/sent/:type", sentOtp);
router.post("/verify", verifyOtp);

module.exports = router;
