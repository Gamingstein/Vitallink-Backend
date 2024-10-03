import { Hospital } from "../models/hospital.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";
import { Sensor } from "../models/sensor.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";

const addPatient = asyncHandler(async (req, res) => {
  const { fullName, gender, age, sensor_id, aadhaar } = req.body;
  if ([fullName, gender, sensor_id].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const existedPatient = await Patient.findOne({
    aadhaar,
  });
  if (existedPatient) {
    throw new ApiError(409, "Patient with aadhaar already exists");
  }

  const createdPatient = await Patient.create({
    fullName,
    gender,
    age,
    sensor_id,
    aadhaar,
    hospital_id: req.user._id,
    admitted: true,
  });

  const hospital = await Hospital.findOne({
    user: req.user._id,
  });
  if (!hospital) {
    throw new ApiError(404, "Hospital not found");
  }

  hospital.patients.push(createdPatient._id);
  await hospital.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, createdPatient, "Patient added successfully"));
});

const removePatient = asyncHandler(async (req, res) => {
  const { aadhaar } = req.body;

  const patient = await Patient.findOneAndUpdate(
    {
      aadhaar,
    },
    { admitted: false, doctors: [], hospital_id: null },
  );

  const hospital = await Hospital.findOne({
    user: req.user._id,
  });

  if (!hospital) {
    throw new ApiError(404, "Hospital not found");
  }

  hospital.patients.pull(patient._id);
  await hospital.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Patient removed"));
});
//tested

const addDoctor = asyncHandler(async (req, res) => {
  const { doctor_id } = req.body;

  const doctor = await Doctor.findById(doctor_id);
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  const hospital = await Hospital.findOne({
    user: req.user._id,
  });
  if (!hospital) {
    throw new ApiError(404, "Hospital not found");
  }

  if (!hospital.doctors.includes(doctor_id)) {
    hospital.doctors.push(doctor._id);
    doctor.hospital.push(hospital._id);
  } else {
    throw new ApiError(409, "Doctor already exists");
  }

  await doctor.save({ validateBeforeSave: false });
  await hospital.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, hospital, "Doctor added successfully"));
});
//tested
const removeDoctor = asyncHandler(async (req, res) => {
  const { doctor_id } = req.body;

  const doctor = await Doctor.findById(doctor_id);
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  const hospital = await Hospital.findOne({
    user: req.user._id,
  });
  if (!hospital) {
    throw new ApiError(404, "Hospital not found");
  }

  doctor.hospital.pull(hospital._id);
  hospital.doctors.pull(doctor._id);
  await hospital.save();
  await doctor.save();

  return res.status(200).json(new ApiResponse(200, hospital, "Doctor removed"));
});

const addSensor = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findOne({
    user: req.user._id,
  });

  if (!hospital) {
    throw new ApiError(404, "Hospital not found");
  }

  const sensor = await Sensor.create({
    hospital_id: hospital._id,
  });

  hospital.sensors.push(sensor._id);
  await hospital.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, sensor, "Sensor added successfully"));
});

const assignDoctor = asyncHandler(async (req, res) => {
  const { doctor_id, patient_id } = req.body;

  const patient = await Patient.findById(patient_id);
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  const doctor = await Doctor.findById(doctor_id);

  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  if (!doctor.patients.includes(patient_id)) {
    doctor.patients.push(patient_id);
    await doctor.save({ validateBeforeSave: false });
  }

  patient.doctors.push(doctor_id);
  await patient.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Doctor assigned"));
});

const dismissDoctor = asyncHandler(async (req, res) => {
  const { doctor_id, patient_id } = req.body;

  const patient = await Patient.findById(patient_id);
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  const doctor = await Doctor.findById(doctor_id);
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  doctor.patients.pull(patient_id);
  patient.doctors.pull(doctor_id);
  await doctor.save();
  await patient.save();

  return res.status(200).json(new ApiResponse(200, {}, "Doctor dismissed"));
});

const getAdmittedPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find({
    hospital_id: req.user._id,
    admitted: true,
  });
  if (!patients) {
    throw new ApiError(404, "No patients found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, patients, "Admitted patients fetched"));
});

const getRegDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({
    hospital: { $in: [req.user._id] },
  });

  if (!doctors) {
    throw new ApiError(404, "No doctors found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, doctors, "Registered doctors fetched"));
});

export {
  addPatient,
  removePatient,
  addDoctor,
  removeDoctor,
  addSensor,
  assignDoctor,
  dismissDoctor,
  getRegDoctors,
  getAdmittedPatients,
};
