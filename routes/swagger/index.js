const { Router } = require("express");
const router = Router();

const swaggerUi = require("swagger-ui-express");
const adminSwagger = require("../../swaggerAi/admin_openapi.json");
const userSwagger = require("../../swaggerAi/user_openapi.json");

router.use(
  "/admin/api-docs",
  swaggerUi.serveFiles(adminSwagger),
  swaggerUi.setup(adminSwagger)
);
router.use(
  "/user/api-docs",
  swaggerUi.serveFiles(userSwagger),
  swaggerUi.setup(userSwagger)
);

module.exports = router;
