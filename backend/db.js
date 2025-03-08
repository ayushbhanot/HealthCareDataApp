const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") }); // Load environment variables

console.log("DATABASE_URL:", process.env.DATABASE_URL); // Debugging

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Change to `true` if SSL is required
});

// Test database connection
pool.connect()
  .then(() => console.log("✅ Connected to YugabyteDB"))
  .catch((err) => console.error("❌ Database connection error:", err));

module.exports = pool;
