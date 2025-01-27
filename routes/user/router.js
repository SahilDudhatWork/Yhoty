const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "User routes is working!!" });
});

const authRoute = require("./auth");
const profileRoute = require("./profile");
const settingRoute = require("./setting");
const cardRoute = require("./card");
const walletRoute = require("./wallet");
const countryRoute = require("./country");
const dashboardRoute = require("./dashboard");
const bannersRoute = require("./banners");
const { userAuth } = require("../../middlewares/authToken/userAuth");
const { checkPermission } = require("../../middlewares/checkPermission");

router.use("/auth", authRoute);
router.use(userAuth);
router.use("/profile", profileRoute);
router.use("/setting", settingRoute);
router.use(checkPermission);
router.use("/card", cardRoute);
router.use("/wallet", walletRoute);
router.use("/country", countryRoute);
router.use("/dashboard", dashboardRoute);
router.use("/banners", bannersRoute);

module.exports = router;
