const { Router } = require("express");
const router = Router();
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const path = require("path");

// Load Swagger JSON Files
const adminSwaggerPath = path.join(
  __dirname,
  "../../swaggerAi/admin_openapi.json"
);
const userSwaggerPath = path.join(
  __dirname,
  "../../swaggerAi/user_openapi.json"
);

// Read JSON Files Dynamically (Ensure they exist)
const adminSwagger = fs.existsSync(adminSwaggerPath)
  ? JSON.parse(fs.readFileSync(adminSwaggerPath, "utf-8"))
  : {};
const userSwagger = fs.existsSync(userSwaggerPath)
  ? JSON.parse(fs.readFileSync(userSwaggerPath, "utf-8"))
  : {};

router.use("/admin/api-docs", swaggerUi.serve, swaggerUi.setup(adminSwagger));
router.use("/user/api-docs", swaggerUi.serve, swaggerUi.setup(userSwagger));

// Serve Swagger UI CSS File
router.get("/v1/swagger/user/api-docs/swagger-ui.css", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../node_modules/swagger-ui-dist/swagger-ui.css")
  );
});

module.exports = router;
