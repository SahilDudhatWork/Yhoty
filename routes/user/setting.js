const { Router } = require("express");
const router = Router();

const {
  changePassword,
} = require("../../controllers/user/setting/changePassword");
const { create } = require("../../controllers/user/report/create");
const { checkPermission } = require("../../middlewares/checkPermission");

router.put("/changePassword", changePassword);
router.use(checkPermission);
router.post("/report", create);

module.exports = router;
