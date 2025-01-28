const { Router } = require("express");
const router = Router();

const {
  viewWalletBal,
} = require("../../controllers/user/wallet/viewWalletBalance");
const {
  fundsTransfer,
} = require("../../controllers/user/wallet/fundsTransfer");
const { getAll } = require("../../controllers/user/wallet/walletTransfer");

router.get("/view/balance", viewWalletBal);
router.post("/funds/transfer", fundsTransfer);
router.get("/transfer", getAll);

module.exports = router;
