const express = require("express");
const router = express.Router();
const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  searchPatients,
} = require("../controllers/patientController");

// Search route must be BEFORE /:id route
router.get("/search", searchPatients);

router.post("/", createPatient);
router.get("/", getAllPatients);
router.get("/:id", getPatientById);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

module.exports = router;
