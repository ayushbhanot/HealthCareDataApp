require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");



const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

app.use("/protected", protectedRoutes);

// Routes
app.use("/users", authRoutes); // User Authentication Routes

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
