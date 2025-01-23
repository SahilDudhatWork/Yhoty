const { Router } = require("express");
const router = Router();

const {
  fetchProfile,
} = require("../../controllers/admin/profile/fetchProfile");
const { update } = require("../../controllers/admin/profile/update");

router.get("/", fetchProfile);
router.put("/", update);

module.exports = router;
