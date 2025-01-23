const { Router } = require("express");
const router = Router();

const { fetchProfile } = require("../../controllers/user/profile/fetchProfile");
const {
  uploadmiddlewares,
  update,
} = require("../../controllers/user/profile/update");

router.get("/", fetchProfile);
router.put("/", uploadmiddlewares, update);

module.exports = router;
