const pool = require("./db"); // Import database connection

const createTables = async () => {
  try {
    console.log("🛠️ Setting up the database tables...");

    // 🟢 Step 1: Enable UUID extension
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    console.log("✅ UUID extension enabled");

    // 🟢 Step 2: Users Table (Admin, Doctors, Staff)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) CHECK (role IN ('admin', 'doctor', 'staff')) NOT NULL,
        refresh_token TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Users table created successfully");

    // 🟢 Step 3: Patients Table (One patient per person)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        dob DATE NOT NULL,
        gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')) NOT NULL,
        contact_number VARCHAR(20),
        language VARCHAR(10) DEFAULT 'EN', -- 🔹 Added for localization support
        next_followup DATE, -- 🔹 Tracks follow-up appointments
        created_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Links to staff/doctor/admin who registered the patient
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        deleted_at TIMESTAMP DEFAULT NULL -- 🔹 Soft delete for auditing
      );
    `);
    console.log("✅ Patients table created successfully");

    // 🟢 Step 4: Medical History Table (Multiple records per patient)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS medical_history (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        patient_id UUID REFERENCES patients(id) ON DELETE CASCADE, -- ✅ Patient can have multiple records
        recorded_by UUID REFERENCES users(id) ON DELETE SET NULL, -- 🔹 Tracks the staff/doctor who entered the record
        updated_by UUID REFERENCES users(id) ON DELETE SET NULL, -- 🔹 Tracks last doctor/staff who updated the record
        loss_of_vision BOOLEAN,
        vision_eye VARCHAR(10) CHECK (vision_eye IN ('R', 'L', 'Both')),
        onset VARCHAR(20) CHECK (onset IN ('Sudden', 'Gradual')),
        pain BOOLEAN,
        duration VARCHAR(10),
        redness BOOLEAN,
        itching BOOLEAN,
        discharge_type VARCHAR(20) CHECK (discharge_type IN ('Clear', 'Sticky')),
        watering BOOLEAN,
        redness_duration VARCHAR(10),
        onset_timeframe VARCHAR(20),
        notes TEXT, -- 🔹 Extra field for additional medical details
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        deleted_at TIMESTAMP DEFAULT NULL -- 🔹 Soft delete for tracking changes
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
