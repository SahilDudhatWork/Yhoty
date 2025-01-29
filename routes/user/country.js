const { Router } = require("express");
const router = Router();

const { getAll } = require("../../controllers/user/country/getAll");
const { getDetails } = require("../../controllers/admin/country/getDetails");

router.get("/", getAll);
router.get("/:id", getDetails);

module.exports = router;
