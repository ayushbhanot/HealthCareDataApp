//For Testing Purposes creating Admin

/* TESTING ADMIN ACCOUNT ACCESS

http://localhost:5003/users/login

{
  "email": "admin@example.com",
  "password": "Admin@123"
}
*/

const bcrypt = require("bcryptjs");
const pool = require("./db");

const createAdminUser = async () => {
  try {
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const result = await pool.query(
      "INSERT INTO users (id, name, email, password, role, created_at) VALUES (uuid_generate_v4(), $1, $2, $3, $4, NOW()) RETURNING *",
      ["Super Admin", "admin@example.com", hashedPassword, "admin"]
    );

    console.log("✅ Admin user created successfully:", result.rows[0]);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    pool.end(); // Close DB connection
  }
};

createAdminUser();
