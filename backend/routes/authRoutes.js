require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
let refreshTokens = []; // Temporary storage for refresh tokens (use DB in production)

// Admin-Only User Registration
router.post("/register", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { name, email, password, role } = req.body;
    const allowedRoles = ["admin", "doctor", "staff"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashedPassword, role]
    );

    res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// User Login with Refresh Token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0 || !(await bcrypt.compare(password, user.rows[0].password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate Access & Refresh Tokens
    const accessToken = jwt.sign({ userId: user.rows[0].id, role: user.rows[0].role }, JWT_SECRET, { expiresIn: "30m" });
    const refreshToken = jwt.sign({ userId: user.rows[0].id }, REFRESH_SECRET, { expiresIn: "14d" });

    refreshTokens.push(refreshToken); // Store refresh token temporarily

    res.json({ accessToken, refreshToken, user: { id: user.rows[0].id, email: user.rows[0].email, role: user.rows[0].role } });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Refresh Token Endpoint
router.post("/refresh-token", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: "Access denied" });
  }

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: "15m" });
    res.json({ accessToken: newAccessToken });
  });
});

// Logout (Invalidate Refresh Token)
router.post("/logout", (req, res) => {
  const { refreshToken } = req.body;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.json({ message: "Logged out successfully" });
});

// Forgot Password (Simplified - send reset link)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ userId: user.rows[0].id }, JWT_SECRET, { expiresIn: "15m" });
    // TODO: Send email with resetToken link (e.g., `https://yourapp.com/reset-password/${resetToken}`)
    
    res.json({ message: "Password reset link sent to email" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
