const { Router } = require("express");
const router = Router();

const { create } = require("../../controllers/user/card/create");
const { getAll } = require("../../controllers/user/card/getAll");
const { getDetails } = require("../../controllers/user/card/getDetails");
const { addFunds } = require("../../controllers/user/card/addFunds");
const { changeStatus } = require("../../controllers/user/card/changeStatus");
const { transactions } = require("../../controllers/user/card/transactions");

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getDetails);
router.put("/addFunds/:id", addFunds);
router.put("/changeStatus/:id", changeStatus);
router.get("/transactions/:id", transactions);

module.exports = router;
