const { Router } = require("express");
const router = Router();

const { getAll } = require("../../controllers/user/transfer/getAll");
const { getDetails } = require("../../controllers/user/transfer/getDetails");
const { getCardTra } = require("../../controllers/user/transfer/getCardTra");

router.get("/", getAll);
router.get("/:id", getDetails);
router.get("/card/:id", getCardTra);

module.exports = router;
