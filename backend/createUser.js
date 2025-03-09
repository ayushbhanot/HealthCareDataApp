//For Testing Purposes creating Admin

/* TESTING ADMIN ACCOUNT ACCESS

http://localhost:5003/users/login

{
  "email": "admin@example.com",
  "password": "Admin@123"
}

{
  "email": "doctor@example.com",
  "password": "Doctor@123"
}

{
  "email": "staff@example.com",
  "password": "Staff@123"
}
*/
const bcrypt = require("bcryptjs");
const pool = require("./db");

const createTestUsers = async () => {
  try {
    // 🔹 Hash passwords
    const hashedAdminPassword = await bcrypt.hash("Admin@123", 10);
    const hashedDoctorPassword = await bcrypt.hash("Doctor@123", 10);
    const hashedStaffPassword = await bcrypt.hash("Staff@123", 10);

    // 🔹 Insert Admin
    const admin = await pool.query(
      "INSERT INTO users (id, name, email, password, role, created_at) VALUES (uuid_generate_v4(), $1, $2, $3, $4, NOW()) RETURNING *",
      ["Super Admin", "admins@example.com", hashedAdminPassword, "admin"]
    );

    // 🔹 Insert Doctor
    const doctor = await pool.query(
      "INSERT INTO users (id, name, email, password, role, created_at) VALUES (uuid_generate_v4(), $1, $2, $3, $4, NOW()) RETURNING *",
      ["Dr. John Doe", "doctor@example.com", hashedDoctorPassword, "doctor"]
    );

    // 🔹 Insert Staff
    const staff = await pool.query(
      "INSERT INTO users (id, name, email, password, role, created_at) VALUES (uuid_generate_v4(), $1, $2, $3, $4, NOW()) RETURNING *",
      ["Nurse Jane", "staff@example.com", hashedStaffPassword, "staff"]
    );

    console.log("✅ Test users created successfully:");
    console.log("👤 Admin:", admin.rows[0]);
    console.log("👤 Doctor:", doctor.rows[0]);
    console.log("👤 Staff:", staff.rows[0]);
  } catch (error) {
    console.error("❌ Error creating test users:", error);
  } finally {
    pool.end(); // Close DB connection
  }
};

// Run script
createTestUsers();
