const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Admin routes is working!!" });
});

const authRoute = require("./auth");
const profileRoute = require("./profile");
const userRoute = require("./user");
const reportRoute = require("./report");
const walletRoute = require("./wallet");
const countryRoute = require("./country");
const bannersRoute = require("./banners");
const { adminAuth } = require("../../middlewares/authToken/adminAuth");

router.use("/auth", authRoute);
router.use(adminAuth);
router.use("/profile", profileRoute);
router.use("/user", userRoute);
router.use("/report", reportRoute);
router.use("/wallet", walletRoute);
router.use("/country", countryRoute);
router.use("/banners", bannersRoute);

module.exports = router;
