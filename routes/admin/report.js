const { Router } = require("express");
const router = Router();

const { getAll } = require("../../controllers/admin/report/getAll");

router.get("/", getAll);

module.exports = router;
