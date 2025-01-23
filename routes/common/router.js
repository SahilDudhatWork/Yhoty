const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Common routes is working!!" });
});

const otpRoute = require("./otp");
const resetPasswordRoute = require("./resetPassword");

router.use("/otp", otpRoute);
router.use("/resetPassword", resetPasswordRoute);

module.exports = router;
