const { Router } = require("express");
const router = Router();
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const path = require("path");

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

// Serve Swagger UI Assets
router.get("/v1/swagger/user/api-docs/swagger-ui.css", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../node_modules/swagger-ui-dist/swagger-ui.css")
  );
});

router.get("/v1/swagger/user/api-docs/swagger-ui.css.map", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "../../node_modules/swagger-ui-dist/swagger-ui.css.map"
    )
  );
});

router.get("/v1/swagger/user/api-docs/favicon-16x16.png", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../node_modules/swagger-ui-dist/favicon-16x16.png")
  );
});

router.get("/v1/swagger/user/api-docs/favicon-32x32.png", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../node_modules/swagger-ui-dist/favicon-32x32.png")
  );
});

router.get("/v1/swagger/user/api-docs/swagger-ui-init.js", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "../../node_modules/swagger-ui-dist/swagger-ui-init.js"
    )
  );
});

router.get("/v1/swagger/user/api-docs/swagger-ui-bundle.js", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "../../node_modules/swagger-ui-dist/swagger-ui-bundle.js"
    )
  );
});

router.get(
  "/v1/swagger/user/api-docs/swagger-ui-standalone-preset.js",
  (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "../../node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js"
      )
    );
  }
);

module.exports = router;
