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
    const {
      first_name,
      last_name,
      dob,
      gender,
      contact_number,
      language,
      next_followup,
      relative_name,
      relative_phone_number,
      address,
      longitude,
      latitude
    } = req.body;
    

    const id_image_url = req.file ? `/uploads/${req.file.filename}` : null;

    // Only doctors and staff can register patients
    if (req.user.role !== "doctor" && req.user.role !== "staff") {
      return res.status(403).json({ message: "Access denied. Only doctors and staff can register patients." });
    }

    const newPatient = await pool.query(
      `INSERT INTO patients 
      (first_name, last_name, dob, gender, contact_number, language, next_followup, 
       relative_name, relative_phone_number, id_image_url, address, longitude, latitude, created_by) 
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
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
        address || null,
        longitude || null,
        latitude || null,
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
      patients = await pool.query(
        "SELECT * FROM patients WHERE deleted_at IS NULL"
      );
    } else {
      patients = await pool.query(
        "SELECT * FROM patients WHERE created_by = $1 AND deleted_at IS NULL",
        [req.user.userId]
      );
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

router.put("/:id", authenticateUser, upload.single("id_image"), async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      dob,
      gender,
      contact_number,
      language,
      next_followup,
      relative_name,
      relative_phone_number,
      address,
      longitude,
      latitude,
    } = req.body;

    const id_image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const patient = await pool.query("SELECT * FROM patients WHERE id = $1", [req.params.id]);

    if (patient.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Only admin or original creator can edit
    if (req.user.role !== "admin" && patient.rows[0].created_by !== req.user.userId) {
      return res.status(403).json({ message: "Access denied." });
    }

    const updatedPatient = await pool.query(
      `UPDATE patients SET 
        first_name = $1,
        last_name = $2,
        dob = $3,
        gender = $4,
        contact_number = $5,
        language = $6,
        next_followup = $7,
        relative_name = $8,
        relative_phone_number = $9,
        address = $10,
        longitude = $11,
        latitude = $12,
        id_image_url = COALESCE($13, id_image_url),
        updated_at = NOW()
      WHERE id = $14
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
        address || null,
        longitude || null,
        latitude || null,
        id_image_url,
        req.params.id
      ]
    );

    res.json({ message: "Patient updated successfully", patient: updatedPatient.rows[0] });
  } catch (error) {
    console.error("❌ Error updating patient:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// router.put("/:id", authenticateUser, async (req, res) => {
//   try {
//     const { first_name, last_name, dob, gender, contact_number, language, next_followup } = req.body;

//     // Find patient
//     const patient = await pool.query("SELECT * FROM patients WHERE id = $1", [req.params.id]);
//     if (patient.rows.length === 0) {
//       return res.status(404).json({ message: "Patient not found" });
//     }

//     // Only the doctor who registered the patient or admin can update
//     if (req.user.role !== "admin" && patient.rows[0].created_by !== req.user.userId) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const updatedPatient = await pool.query(
//       `UPDATE patients SET first_name = $1, last_name = $2, dob = $3, gender = $4, 
//        contact_number = $5, language = $6, next_followup = $7, updated_at = NOW() WHERE id = $8 RETURNING *`,
//       [first_name, last_name, dob, gender, contact_number, language, next_followup, req.params.id]
//     );

//     res.json({ message: "Patient updated successfully", patient: updatedPatient.rows[0] });
//   } catch (error) {
//     console.error("❌ Error updating patient:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

/**
 * Soft Delete Patient (DELETE /patients/:id)
 */
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const patient = await pool.query("SELECT * FROM patients WHERE id = $1", [req.params.id]);

    if (patient.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    await pool.query("UPDATE patients SET deleted_at = NOW() WHERE id = $1", [req.params.id]);

    res.json({ message: "Patient deleted (soft delete applied)." });
  } catch (error) {
    console.error("❌ Error deleting patient:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/medicalHistory/:patient_id", authenticateUser, async (req, res) => {
  try {
    const { patient_id } = req.params;
    
    // Query the medical_history table for records matching the provided patient_id
    const historyResult = await pool.query(
      "SELECT * FROM medical_history WHERE patient_id = $1",
      [patient_id]
    );
    
    // Check if any record exists for the given patient
    if (historyResult.rows.length === 0) {
      return res.status(404).json({ message: "No medical history record found for this patient" });
    }
    
    // Return the found records
    res.status(200).json({ medical_history: historyResult.rows });
  } catch (error) {
    console.error("Error retrieving medical history:", error);
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * Create Medical History (POST /medical_history)
 * Creates a new record in the medical_history table for a patient.
 * @Param: medications(text), allergies(text), eye_injuries(text), eye_surgeries(text), social_history(text), family_history(text), patient_id(uuid),
 *         diabetes(boolean), hypertension(boolean), nearsightedness(boolean), farsightedness(boolean), eye_glasses_or_lenses(boolean)
 */
router.post("/medicalHistory", authenticateUser, async (req, res) => {
  try {
    const {
      medications,
      allergies,
      eye_injuries,
      eye_surgeries,
      social_history,
      family_history,
      patient_id,
      diabetes,
      hypertension,
      nearsightedness,
      farsightedness,
      eye_glasses_or_lenses
    } = req.body;

    const newHistory = await pool.query(
      `INSERT INTO medical_history 
        (medications, allergies, eye_injuries, eye_surgeries, social_history, family_history, created_at, patient_id,
         diabetes, hypertension, nearsightedness, farsightedness, eye_glasses_or_lenses) 
       VALUES 
        ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [medications, allergies, eye_injuries, eye_surgeries, social_history, family_history, patient_id,
       diabetes, hypertension, nearsightedness, farsightedness, eye_glasses_or_lenses]
    );

    res.status(201).json({ 
      message: "Medical history created successfully", 
      medical_history: newHistory.rows[0] 
    });
  } catch (error) {
    console.error("❌ Error creating medical history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Update Medical History (PUT /medical_history/:history_id)
 * Updates an existing record in the medical_history table.
 * Accepts updates for both the text fields and the new boolean fields.
 */
router.put("/updateMedicalHistory/:history_id", authenticateUser, async (req, res) => {
  try {
    const {
      medications,
      allergies,
      eye_injuries,
      eye_surgeries,
      social_history,
      family_history,
      diabetes,
      hypertension,
      nearsightedness,
      farsightedness,
      eye_glasses_or_lenses
    } = req.body;
    const { history_id } = req.params;

    // Check if the medical history record exists
    const historyResult = await pool.query(
      "SELECT * FROM medical_history WHERE history_id = $1", 
      [history_id]
    );
    if (historyResult.rows.length === 0) {
      return res.status(404).json({ message: "Medical history record not found" });
    }

    // Update the medical history record
    const updatedHistory = await pool.query(
      `UPDATE medical_history SET 
         medications = $1,
         allergies = $2,
         eye_injuries = $3,
         eye_surgeries = $4,
         social_history = $5,
         family_history = $6,
         diabetes = $7,
         hypertension = $8,
         nearsightedness = $9,
         farsightedness = $10,
         eye_glasses_or_lenses = $11
       WHERE history_id = $12
       RETURNING *`,
      [medications, allergies, eye_injuries, eye_surgeries, social_history, family_history,
       diabetes, hypertension, nearsightedness, farsightedness, eye_glasses_or_lenses, history_id]
    );

    res.json({ 
      message: "Medical history updated successfully", 
      medical_history: updatedHistory.rows[0] 
    });
  } catch (error) {
    console.error("❌ Error updating medical history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Get Medical History for a Patient (GET /medicalHistory/:patient_id)
 * Retrieves all medical history records for a given patient.
 */
router.get("/medicalHistory/:patient_id", authenticateUser, async (req, res) => {
  try {
    const { patient_id } = req.params;
    
    const historyResult = await pool.query(
      "SELECT * FROM medical_history WHERE patient_id = $1",
      [patient_id]
    );
    
    if (historyResult.rows.length === 0) {
      return res.status(404).json({ message: "No medical history record found for this patient" });
    }
    
    res.status(200).json({ medical_history: historyResult.rows });
  } catch (error) {
    console.error("❌ Error retrieving medical history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Get symptoms for a Patient.
 * Retrieves all symptoms a patient has.
 */

router.get("/symptoms/:patient_id", authenticateUser, async (req, res) => {
  try {
    const { patient_id } = req.params;
    
    // Join the Symptoms, Medical_History_Symptoms, and medical_history tables
    const symptomsResult = await pool.query(
      `SELECT S.*
       FROM Symptoms S
       JOIN Medical_History_Symptoms MHS ON S.symptom_id = MHS.symptom_id
       JOIN medical_history MH ON MH.history_id = MHS.history_id
       WHERE MH.patient_id = $1`,
      [patient_id]
    );
    
    if (symptomsResult.rows.length === 0) {
      return res.status(404).json({ message: "No symptoms found for this patient" });
    }
    
    res.status(200).json({ symptoms: symptomsResult.rows });
  } catch (error) {
    console.error("❌ Error retrieving symptoms for patient:", error);
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * Add Symptom to Medical History (POST /addSymptom)
 * Request Body Parameters:
 * - patient_id (string/uuid): The ID of the patient.
 * - symptom_name (string): The name of the symptom.
 *
 * If the symptom already exists in the Symptoms table, its id is reused and its tracker is incremented.
 * If not, a new symptom is inserted with tracker = 1.
 * Then, a new record is inserted in the Medical_History_Symptoms junction table,
 * unless the association already exists.
 */
router.post("/addSymptom", authenticateUser, async (req, res) => {
  try {
    const { patient_id, symptom_name } = req.body;
    
    if (!patient_id || !symptom_name) {
      return res.status(400).json({ message: "Missing patient_id or symptom_name" });
    }
    
    // Retrieve the medical history record for the patient
    const historyResult = await pool.query(
      "SELECT history_id FROM medical_history WHERE patient_id = $1",
      [patient_id]
    );
    
    if (historyResult.rows.length === 0) {
      return res.status(404).json({ message: "Medical history record not found for this patient" });
    }
    
    // Assuming a patient has one medical history record
    const history_id = historyResult.rows[0].history_id;
    
    // Check if the symptom already exists in the Symptoms table
    let symptomResult = await pool.query(
      "SELECT symptom_id FROM Symptoms WHERE symptom_name = $1",
      [symptom_name]
    );
    
    let symptom_id;
    if (symptomResult.rows.length > 0) {
      // Symptom exists; use its id.
      symptom_id = symptomResult.rows[0].symptom_id;
      
      // Check if the symptom is already linked to the medical history
      const associationResult = await pool.query(
        "SELECT history_symptom_id FROM Medical_History_Symptoms WHERE history_id = $1 AND symptom_id = $2",
        [history_id, symptom_id]
      );
      
      if (associationResult.rows.length > 0) {
        return res.status(200).json({ message: "Symptom already linked to this medical history" });
      }
      
      // Increment the tracker count for this symptom
      await pool.query(
        "UPDATE Symptoms SET tracker = tracker + 1 WHERE symptom_id = $1",
        [symptom_id]
      );
    } else {
      // Insert new symptom with tracker = 1, then get its id.
      let insertSymptom = await pool.query(
        "INSERT INTO Symptoms (symptom_name, tracker) VALUES ($1, 1) RETURNING symptom_id",
        [symptom_name]
      );
      symptom_id = insertSymptom.rows[0].symptom_id;
    }
    
    // Create a new link between the medical history and the symptom
    const newAssociation = await pool.query(
      "INSERT INTO Medical_History_Symptoms (history_id, symptom_id) VALUES ($1, $2) RETURNING history_symptom_id",
      [history_id, symptom_id]
    );
    
    res.status(201).json({
      message: "Symptom added and linked successfully",
      association: newAssociation.rows[0],
      symptom_id
    });
  } catch (error) {
    console.error("❌ Error adding symptom:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/removeSymptom/:patient_id/:symptom_name", authenticateUser, async (req, res) => {
  try {
    const { patient_id, symptom_name } = req.params;
    
    // Look up the symptom_id using the symptom name
    const symptomResult = await pool.query(
      "SELECT symptom_id FROM Symptoms WHERE symptom_name = $1",
      [symptom_name]
    );
    
    if (symptomResult.rows.length === 0) {
      return res.status(404).json({ message: "Symptom not found" });
    }
    
    const symptom_id = symptomResult.rows[0].symptom_id;
    
    // Find the medical history record for the given patient.
    const historyResult = await pool.query(
      "SELECT history_id FROM medical_history WHERE patient_id = $1",
      [patient_id]
    );
    
    if (historyResult.rows.length === 0) {
      return res.status(404).json({ message: "No medical history found for the patient" });
    }
    
    // For simplicity, assume a patient has one medical history record.
    const history_id = historyResult.rows[0].history_id;
    
    // Check if the association between the medical history and the symptom exists.
    const associationResult = await pool.query(
      "SELECT history_symptom_id FROM Medical_History_Symptoms WHERE history_id = $1 AND symptom_id = $2",
      [history_id, symptom_id]
    );
    
    if (associationResult.rows.length === 0) {
      return res.status(404).json({ message: "Symptom association not found for this patient's medical history" });
    }
    
    // Delete the association from the junction table.
    await pool.query(
      "DELETE FROM Medical_History_Symptoms WHERE history_id = $1 AND symptom_id = $2",
      [history_id, symptom_id]
    );
    
    // Decrement the tracker count for the symptom.
    await pool.query(
      "UPDATE Symptoms SET tracker = tracker - 1 WHERE symptom_id = $1",
      [symptom_id]
    );
    
    res.status(200).json({ message: "Symptom removed from patient's medical history successfully" });
  } catch (error) {
    console.error("❌ Error removing symptom:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Get Top 25 Symptoms (GET /topSymptoms)
 * Returns up to 25 symptoms sorted by tracker count in descending order.
 */
router.get("/search/topSymptoms", authenticateUser, async (req, res) => {
  try {
    const topSymptoms = await pool.query(
      "SELECT * FROM Symptoms ORDER BY tracker DESC LIMIT 25"
    );
    res.status(200).json({ symptoms: topSymptoms.rows });
  } catch (error) {
    console.error("❌ Error fetching top symptoms:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Search Symptoms (GET /search/symptoms)
 * Accepts a query parameter "q" to search for similar symptoms.
 * For example: GET /search/symptoms?q=fever
 */
router.get("/search/symptoms", authenticateUser, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Missing search query parameter 'q'" });
    }
    
    // Create a pattern for case-insensitive matching
    const searchPattern = `%${q}%`;
    
    // Query the Symptoms table for similar symptom names
    const results = await pool.query(
      "SELECT * FROM Symptoms WHERE symptom_name ILIKE $1 ORDER BY tracker DESC",
      [searchPattern]
    );
    
    res.status(200).json({ symptoms: results.rows });
  } catch (error) {
    console.error("❌ Error searching symptoms:", error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
