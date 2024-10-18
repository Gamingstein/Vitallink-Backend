import { Hospital } from "../models/hospital.model.js";
import { Doctor } from "../models/doctor.model.js";
import { User } from "../models/user.model.js";
import { Patient } from "../models/patient.model.js";
import { Sensor } from "../models/sensor.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";

const addPatient = asyncHandler(async (req, res) => {
  const { name, gender, age, sensor_id, aadhaar } = req.body;
  if ([name, gender, sensor_id].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const hospital = await Hospital.findOne({
    user: req.user._id,
  });
  if (!hospital) {
    throw new ApiError(404, "Hospital not found");
  }

  const sensor = await Sensor.findById(sensor_id);
  if (!sensor) {
    throw new ApiError(404, "Sensor not found");
  }

  const existedPatient = await Patient.findOne({
    aadhaar,
  });
  if (existedPatient) {
    if (!existedPatient?.admitted) {
      existedPatient.admitted = true;
      existedPatient.sensor_id = sensor._id;
      existedPatient.hospital_id = hospital._id;
      await existedPatient.save({ validateBeforeSave: false });
      hospital.patients.push(existedPatient._id);
      await hospital.save({ validateBeforeSave: false });
      return res
        .status(200)
        .json(new ApiResponse(200, existedPatient, "Patient's revisit marked"));
    }
    throw new ApiError(409, "Patient with aadhaar already admitted");
  }

  const createdPatient = await Patient.create({
    name,
    gender,
    age,
    sensor_id: sensor._id,
    aadhaar,
    hospital_id: hospital._id,
    admitted: true,
  });

  hospital.patients.push(createdPatient._id);
  await hospital.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, createdPatient, "Patient added successfully"));
});

const removePatient = asyncHandler(async (req, res) => {
  const { patient_id } = req.body;

  const patient = await Patient.findByIdAndUpdate(patient_id, {
    $set: {
      admitted: false,
      sensor_id: null,
      doctors: [],
      hospital_id: null,
    },
  });

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

const addDoctor = asyncHandler(async (req, res) => {
  const { username } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User not exist");
  }

  const doctor = await Doctor.findOne({ user: user._id });
  if (!doctor) {
    throw new ApiError(404, "Doctor not found with this username");
  }

  const hospital = await Hospital.findOne({
    user: req.user._id,
  });
  if (!hospital) {
    throw new ApiError(404, "Hospital not found");
  }

  if (!hospital.doctors.includes(doctor._id)) {
    hospital.doctors.push(doctor._id);
    doctor.hospitals.push(hospital._id);
  } else {
    throw new ApiError(409, "Doctor already exists");
  }

  await doctor.save({ validateBeforeSave: false });
  await hospital.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, hospital, "Doctor added successfully"));
});

const removeDoctor = asyncHandler(async (req, res) => {
  const { doctor_id } = req.body;

  const doctor = await Doctor.findById(doctor_id);
  if (!doctor) {
    throw new ApiError(404, "Doctor not found with this username");
  }

  const hospital = await Hospital.findOne({
    user: req.user._id,
  });
  if (!hospital) {
    throw new ApiError(404, "Hospital not found");
  }

  if (
    !doctor.hospitals.includes(hospital._id) ||
    !hospital.doctors.includes(doctor._id)
  ) {
    throw new ApiError(409, "Doctor does not belong to this hospital");
  }

  doctor.hospitals.pull(hospital._id);
  hospital.doctors.pull(doctor._id);
  await hospital.save();
  await doctor.save();

  return res.status(200).json(new ApiResponse(200, hospital, "Doctor removed"));
});

const addSensor = asyncHandler(async (req, res) => {
  const { sensor_id } = req.body;
  const hospital = await Hospital.findOne({
    user: req.user._id,
  });

  if (!hospital) {
    throw new ApiError(404, "Hospital not found");
  }

  const sensor = await Sensor.create({
    hospital_id: hospital._id,
    sensorID: sensor_id,
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

  const hospital = await Hospital.findOne({ user: req.user._id });
  if (!hospital) {
    throw new ApiError(404, "Hospital not found");
  }

  if (
    !hospital.doctors.includes(doctor._id) ||
    !hospital.patients.includes(patient._id)
  ) {
    throw new ApiError(
      409,
      "Doctor or patient does not belong to this hospital",
    );
  }

  if (patient.doctors.includes(doctor._id)) {
    throw new ApiError(409, "Doctor already assigned to this patient");
  }

  if (!doctor.patients.includes(patient._id)) {
    doctor.patients.push(patient._id);
    await doctor.save({ validateBeforeSave: false });
  }

  patient.doctors.push(doctor._id);
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
  if (
    !doctor.patients.includes(patient._id) ||
    !patient.doctors.includes(doctor._id)
  ) {
    throw new ApiError(409, "Doctor not assigned to this patient");
  }
  doctor.patients.pull(patient._id);
  patient.doctors.pull(doctor._id);
  await doctor.save();
  await patient.save();

  return res.status(200).json(new ApiResponse(200, {}, "Doctor dismissed"));
});

const getAdmittedPatients = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findOne({ user: req.user._id });
  if (!hospital) {
    throw new ApiError(404, "Hospital doesn't exist");
  }
  const patients = await Patient.find({
    hospital_id: hospital._id,
    admitted: true,
  }).populate("sensor_id");
  if (!patients) {
    throw new ApiError(404, "No patients found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, patients, "Admitted patients fetched"));
});

const getRegDoctors = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findOne({ user: req.user._id });
  if (!hospital) {
    throw new ApiError(404, "Hospital doesn't exist");
  }
  const doctors = await Doctor.find({
    hospital: { $in: [hospital._id] },
  }).populate("user");

  if (!doctors) {
    throw new ApiError(404, "No doctors found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, doctors, "Registered doctors fetched"));
});

const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find().populate("user");
  if (!doctors) {
    throw new ApiError(404, "No doctors found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, doctors, "All doctors fetched"));
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
  getAllDoctors,
};
