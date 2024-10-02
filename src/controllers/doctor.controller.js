import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";

const addPatient = asyncHandler(async (req, res) => {
  try {
    const { patient_id } = req.body;
    const doctor = await Doctor.findOne({ _id: req.user._id });

    if (!doctor) {
      return new ApiError(404, "Doctor not found");
    }
    const patient = await Patient.findOne({ _id: patient_id });
    if (!patient) {
      return new ApiError(404, "Patient not found");
    }
    doctor.patients.push(patient_id);
    await doctor.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, doctor, "Patient added successfully"));
  } catch (err) {
    return new ApiError(500, "Something went wrong while adding patient");
  }
});

const removePatient = asyncHandler(async (req, res) => {
  try {
    const { patient_id } = req.body;
    const doctor = await Doctor.findOne({ _id: req.user._id });
    if (!doctor) {
      return new ApiError(404, "Doctor not found");
    }
    const patient = await Patient.findOne({ _id: patient_id });
    if (!patient) {
      return new ApiError(404, "Patient not found");
    }
    doctor.patients.pull(patient_id);
    await doctor.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, doctor, "Patient removed"));
  } catch (err) {
    return new ApiError(500, "Something went wrong while removing patient");
  }
});

// TODO: Implement getPatientsList
const getPatientsList = asyncHandler(async (req, res) => {
  try {
    const patients = await Doctor.findOne({ _id: req.user._id }).populate(
      "patients",
    );
    if (!patients) {
      return new ApiError(404, "No Patients not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, patients, "Patients list"));
  } catch (err) {
    return new ApiError(
      500,
      "Something went wrong while getting patients list",
    );
  }
});

const getPatientInfo = asyncHandler(async (req, res) => {
  try {
    const { patient_id } = req.body;
    const patient = await Patient.findOne({ _id: patient_id }).populate(
      "sensor",
    );
    if (!patient) {
      return new ApiError(404, "Patient not found");
    }
    return res.status(200).json(new ApiResponse(200, patient, "Patient info"));
  } catch (err) {
    return new ApiError(500, "Something went wrong while getting patient info");
  }
});

export { addPatient, removePatient, getPatientsList, getPatientInfo };
