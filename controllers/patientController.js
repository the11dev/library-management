const Patient = require("../models/Patient");

// POST /patients - Register a new patient
const createPatient = async (req, res, next) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// GET /patients - Get all patient records
const getAllPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    next(error);
  }
};

// GET /patients/search?name=xyz - Search patient by name
const searchPatients = async (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Please provide a name to search" });
    }
    const patients = await Patient.find({
      fullName: { $regex: name, $options: "i" },
    });
    if (patients.length === 0) {
      return res.status(404).json({ message: "No patients found" });
    }
    res.status(200).json(patients);
  } catch (error) {
    next(error);
  }
};

// GET /patients/:id - Get patient by ID
const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    next(error);
  }
};

// PUT /patients/:id - Update patient details
const updatePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// DELETE /patients/:id - Delete patient record
const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  searchPatients,
};
