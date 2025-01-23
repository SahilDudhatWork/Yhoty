const { Router } = require("express");
const router = Router();

const { create } = require("../../controllers/admin/country/create");
const { remove } = require("../../controllers/admin/country/delete");
const { getAll } = require("../../controllers/admin/country/getAll");
const { getDetails } = require("../../controllers/admin/country/getDetails");
const { update } = require("../../controllers/admin/country/update");

router.post("/", create);
router.get("/", getAll);
router.delete("/:id", remove);
router.get("/:id", getDetails);
router.put("/:id", update);

module.exports = router;
