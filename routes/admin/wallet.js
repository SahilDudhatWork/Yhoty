const { Router } = require("express");
const router = Router();

const {
  viewWalletBal,
} = require("../../controllers/admin/wallet/viewWalletBalance");

router.get("/view/balance", viewWalletBal);

module.exports = router;
