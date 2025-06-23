const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./src/routes/authRoutes");
const adRoutes = require("./src/routes/adRoutes");
const userRoutes = require('./src/routes/userRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const fs = require("fs"); // Node built-in
const path = require("path"); // Node built-in
const yaml = require("js-yaml"); // npm install js-yaml
const swaggerUi = require("swagger-ui-express"); // npm install swagger-ui-express

// Initialize dotenv
dotenv.config();

// Create the app first
const app = express();

// Load Swagger after app is created
const swaggerFile = fs.readFileSync(
  path.join(__dirname, "swagger.yaml"),
  "utf8"
);
const swaggerDocument = yaml.load(swaggerFile);

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger Route
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/users", userRoutes);

// Root Route
app.get("/", (req, res) => {
  res.status(200).send("✅ Advert Platform Backend is live!");
});

// Index Route
app.get("/api", (req, res) => {
  res.json({
    message: "✅ Advert Platform Backend is Live",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login"
      },
      ads: {
        getAllAds: "GET /api/ads",
        getAdById: "GET /api/ads/:id",
        createAd: "POST /api/ads",
        updateAd: "PUT /api/ads/:id",
        deleteAd: "DELETE /api/ads/:id"
      }
    }
  });
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({ error: "Route Not Found" });
});

// Error handler
app.use(errorHandler);

module.exports = app;
