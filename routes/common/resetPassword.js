const { Router } = require("express");
const router = Router();

const {
  resetPassword,
} = require("../../controllers/common/forgotPassword/resetPassword");
const { verifyOtpToken } = require("../../middlewares/verifyOtpToken");

router.post("/:type", verifyOtpToken, resetPassword);

module.exports = router;
