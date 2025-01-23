const { Router } = require("express");
const router = Router();

const { getAll } = require("../../controllers/user/country/getAll");

router.get("/", getAll);

module.exports = router;
