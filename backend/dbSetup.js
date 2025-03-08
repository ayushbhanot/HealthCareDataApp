const pool = require("./db"); // Import database connection

const createTables = async () => {
  try {
    console.log("🛠️ Setting up the database tables...");

    // 🟢 Step 1: Enable UUID extension
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    console.log("✅ UUID extension enabled");

    // 🟢 Step 2: Drop and Recreate Users Table (Fix Missing Columns)
    await pool.query(`DROP TABLE IF EXISTS users CASCADE;`);
    await pool.query(`
      CREATE TABLE users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) CHECK (role IN ('admin', 'doctor', 'staff')) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Users table created successfully");

    // 🟢 Step 3: Drop and Recreate Patients Table
    await pool.query(`DROP TABLE IF EXISTS patients CASCADE;`);
    await pool.query(`
      CREATE TABLE patients (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        dob DATE NOT NULL,
        gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')) NOT NULL,
        contact_number VARCHAR(20),
        created_by UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Patients table created successfully");

    // 🟢 Step 4: Drop and Recreate Medical History Table
    await pool.query(`DROP TABLE IF EXISTS medical_history CASCADE;`);
    await pool.query(`
      CREATE TABLE medical_history (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
        loss_of_vision BOOLEAN,
        vision_eye VARCHAR(10) CHECK (vision_eye IN ('R', 'L', 'Both')),
        onset VARCHAR(20) CHECK (onset IN ('Sudden', 'Gradual')),
        pain BOOLEAN,
        duration VARCHAR(10),
        redness BOOLEAN,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Medical History table created successfully");

  } catch (err) {
    console.error("❌ Error creating tables:", err);
  } finally {
    pool.end(); // Close the database connection
  }
};

// Run the function to create tables
createTables();
