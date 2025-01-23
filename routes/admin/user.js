const { Router } = require("express");
const router = Router();

const { getAll } = require("../../controllers/admin/user/getAll");
const { getDetails } = require("../../controllers/admin/user/getDetails");
const {
  verifyOrUnverify,
} = require("../../controllers/admin/user/verifyOrUnverify");

router.get("/", getAll);
router.get("/:id", getDetails);
router.put("/:type/:id", verifyOrUnverify);

module.exports = router;
