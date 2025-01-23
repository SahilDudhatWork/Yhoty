const express = require("express");
const app = express();

const cors = require("cors");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const routes = require("./routes/v1");
const MongoDBconnect = require("./library/db");
const { PORT } = process.env;
require("dotenv").config();

// Body-parser
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// SwaggerAi
app.use(express.static(path.join(__dirname, "swaggerAi")));
// Uploads
app.use(express.static(path.join(__dirname, "uploads")));

// Routers
app.use("/v1", routes);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Wel Come Our YhOtY - V1.0.1" });
});

// DB Connection
MongoDBconnect()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`        \x1b[1m\x1b[35m╭──────────────────────────────────╮
        │ \x1b[36m🕒 Application is listening On :  >>> 🚀 \x1b[91m${PORT} \x1b[32m🚀
        ╰──────────────────────────────────╯\x1b[0m`);
    });
  })
  .catch((error) => {
    console.error("Error Connecting Mongodb:", error);
  });
