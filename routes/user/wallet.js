const { Router } = require("express");
const router = Router();

const {
  viewWalletBal,
} = require("../../controllers/user/wallet/viewWalletBalance");

router.get("/view/balance", viewWalletBal);

module.exports = router;
