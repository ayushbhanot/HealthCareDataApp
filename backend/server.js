require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const patientRoutes = require("./routes/patientsRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");


const app = express();
app.use("/uploads", express.static("uploads"));


// Debugging: Check if JWT_SECRET is loaded
console.log("🔍 JWT_SECRET:", process.env.JWT_SECRET); 

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

app.use("/protected", protectedRoutes);
app.use("/patients", patientRoutes);
app.use("/analytics",analyticsRoutes);

// Routes
app.use("/users", authRoutes); // User Authentication Routes

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
