const { Router } = require("express");
const router = Router();

const {
  viewWalletBal,
} = require("../../controllers/user/wallet/viewWalletBalance");
const {
  fundsTransfer,
} = require("../../controllers/user/wallet/fundsTransfer");

router.get("/view/balance", viewWalletBal);
router.post("/funds/transfer", fundsTransfer);

module.exports = router;
