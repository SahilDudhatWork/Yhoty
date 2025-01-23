const { Router } = require("express");
const router = Router();

const { logIn } = require("../../controllers/user/auth/logIn");
const {
  uploadmiddlewares,
  signUp,
} = require("../../controllers/user/auth/signUp");
const {
  validateEmailAndPass,
} = require("../../middlewares/validateEmailAndPass");
const { verifyOtp } = require("../../controllers/user/auth/verifyOtp");

router.post("/signUp", uploadmiddlewares, validateEmailAndPass, signUp);
router.post("/logIn", validateEmailAndPass, logIn);
router.post("/verifyOtp", verifyOtp);

module.exports = router;
