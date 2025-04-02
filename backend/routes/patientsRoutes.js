const express = require("express");
const pool = require("../db");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

const multer = require('multer');
const path = require('path');

// Storage config
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

/**
 * Register a New Patient (POST /patients)
 * Only doctors & staff can register patients
 */
router.post("/", authenticateUser, upload.single("id_image"), async (req, res) => {
  try {
    const { first_name, last_name, dob, gender, contact_number, language, next_followup, relative_name, relative_phone_number } = req.body;

    const id_image_url = req.file ? `/uploads/${req.file.filename}` : null;

    // Only doctors and staff can register patients
    if (req.user.role !== "doctor" && req.user.role !== "staff") {
      return res.status(403).json({ message: "Access denied. Only doctors and staff can register patients." });
    }

    const newPatient = await pool.query(
      `INSERT INTO patients 
      (first_name, last_name, dob, gender, contact_number, language, next_followup, 
       relative_name, relative_phone_number, id_image_url, created_by) 
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        first_name,
        last_name,
        dob,
        gender,
        contact_number,
        language,
        next_followup,
        relative_name || null,
        relative_phone_number || null,
        id_image_url,
        req.user.userId,
      ]
    );

    res.status(201).json({ message: "Patient registered successfully", patient: newPatient.rows[0] });
  } catch (error) {
    console.error("❌ Error registering patient:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Get All Patients (GET /patients)
 * - Admins can see all patients
 * - Doctors can see only their assigned patients
 */
router.get("/", authenticateUser, async (req, res) => {
  try {
    let patients;
    if (req.user.role === "admin") {
      patients = await pool.query("SELECT * FROM patients");
    } else {
      patients = await pool.query("SELECT * FROM patients WHERE created_by = $1", [req.user.userId]);
    }

    res.json({ patients: patients.rows });
  } catch (error) {
    console.error("❌ Error fetching patients:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Get Single Patient (GET /patients/:id)
 */
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const patient = await pool.query("SELECT * FROM patients WHERE id = $1", [req.params.id]);

    if (patient.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Doctors should only see patients they registered
    if (req.user.role !== "admin" && patient.rows[0].created_by !== req.user.userId) {
      return res.status(403).json({ message: "Access denied." });
    }

    res.json({ patient: patient.rows[0] });
  } catch (error) {
    console.error("❌ Error fetching patient:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Update Patient (PUT /patients/:id)
 */
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const { first_name, last_name, dob, gender, contact_number, language, next_followup } = req.body;

    // Find patient
    const patient = await pool.query("SELECT * FROM patients WHERE id = $1", [req.params.id]);
    if (patient.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Only the doctor who registered the patient or admin can update
    if (req.user.role !== "admin" && patient.rows[0].created_by !== req.user.userId) {
      return res.status(403).json({ message: "Access denied." });
    }

    const updatedPatient = await pool.query(
      `UPDATE patients SET first_name = $1, last_name = $2, dob = $3, gender = $4, 
       contact_number = $5, language = $6, next_followup = $7, updated_at = NOW() WHERE id = $8 RETURNING *`,
      [first_name, last_name, dob, gender, contact_number, language, next_followup, req.params.id]
    );

    res.json({ message: "Patient updated successfully", patient: updatedPatient.rows[0] });
  } catch (error) {
    console.error("❌ Error updating patient:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Soft Delete Patient (DELETE /patients/:id)
 */
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const patient = await pool.query("SELECT * FROM patients WHERE id = $1", [req.params.id]);

    if (patient.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Only admin can delete patients
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Only admins can delete patients." });
    }

    await pool.query("UPDATE patients SET deleted_at = NOW() WHERE id = $1", [req.params.id]);

    res.json({ message: "Patient deleted (soft delete applied)." });
  } catch (error) {
    console.error("❌ Error deleting patient:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
