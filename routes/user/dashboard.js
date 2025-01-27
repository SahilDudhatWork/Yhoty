const { Router } = require("express");
const router = Router();

const { getDetails } = require("../../controllers/user/dashboard/getDetails");

router.get("/", getDetails);

module.exports = router;
