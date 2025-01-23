const { Router } = require("express");
const router = Router();

const { logIn } = require("../../controllers/admin/auth/logIn");
const { signUp } = require("../../controllers/admin/auth/signUp");
const {
  validateEmailAndPass,
} = require("../../middlewares/validateEmailAndPass");

router.post("/logIn", validateEmailAndPass, logIn);
router.post("/signUp", validateEmailAndPass, signUp);

module.exports = router;
