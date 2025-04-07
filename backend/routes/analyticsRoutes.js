const express = require("express");
const router = express.Router();
const pool = require("../db"); // Make sure this points to your configured PG pool

// === GET: List all available symptoms for dropdown ===
router.get("/symptoms-list", async (req, res) => {
  try {
    const query = `SELECT symptom_name FROM Symptoms ORDER BY symptom_name;`;
    const { rows } = await pool.query(query);
    res.json(rows); // Example: [{ symptom_name: 'Redness' }, { symptom_name: 'Itching' }]
  } catch (error) {
    console.error("Error fetching symptoms list:", error);
    res.status(500).json({ message: "Failed to fetch symptoms list" });
  }
});

// === POST: Get count of patients for selected symptoms ===
router.post("/symptoms-count", async (req, res) => {
  const { symptoms } = req.body;

  if (!Array.isArray(symptoms) || symptoms.length === 0 || symptoms.length > 5) {
    return res.status(400).json({ message: "Please provide 1 to 5 symptoms in an array." });
  }

  try {
    const query = `
      SELECT s.symptom_name,
             COUNT(DISTINCT mh.patient_id) AS patient_count
      FROM Medical_History_Symptoms mhs
      JOIN Symptoms s ON mhs.symptom_id = s.symptom_id
      JOIN Medical_History mh ON mhs.history_id = mh.history_id
      WHERE s.symptom_name = ANY($1::text[])
      GROUP BY s.symptom_name
      ORDER BY patient_count DESC;
    `;
    const { rows } = await pool.query(query, [symptoms]);
    res.json(rows); // Example: [{ symptom_name: "Itching", patient_count: 12 }, ...]
  } catch (error) {
    console.error("Error fetching symptom counts:", error);
    res.status(500).json({ message: "Failed to fetch symptom counts" });
  }
});

// === GET: Line chart - patients registered per month ===
router.get("/patients-per-month", async (req, res) => {
  try {
    const query = `
      SELECT TO_CHAR(created_at, 'YYYY-MM') AS month,
             COUNT(*) AS count
      FROM Patients
      WHERE created_at IS NOT NULL
      GROUP BY month
      ORDER BY month;
    `;
    const { rows } = await pool.query(query);
    res.json(rows); // Example: [{ month: '2024-12', count: 10 }, ...]
  } catch (error) {
    console.error("Error fetching patients per month:", error);
    res.status(500).json({ message: "Failed to fetch monthly registrations" });
  }
});

module.exports = router;