const { Router } = require("express");
const router = Router();
const {
  uploadMiddleware,
  createOrUpdate,
} = require("../../controllers/admin/banners/createOrUpdate");
const {
  bannersDetails,
} = require("../../controllers/admin/banners/bannersDetails");

router.post("/", uploadMiddleware, createOrUpdate);
router.get("/", bannersDetails);

module.exports = router;
