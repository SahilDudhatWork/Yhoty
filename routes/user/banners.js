const { Router } = require("express");
const router = Router();
const {
  bannersDetails,
} = require("../../controllers/admin/banners/bannersDetails");

router.get("/", bannersDetails);

module.exports = router;
