const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const patientRoutes = require("./routes/patientRoutes");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/patients", patientRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
