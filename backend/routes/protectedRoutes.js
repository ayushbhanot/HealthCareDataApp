const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

// Example: Protected Route (Only logged-in users can access)
router.get("/dashboard", authenticateUser, (req, res) => {
  res.json({ message: `Welcome, user with role: ${req.user.role}` });
});

module.exports = router;
