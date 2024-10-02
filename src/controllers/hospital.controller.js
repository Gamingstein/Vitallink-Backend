import { Hospital } from "../models/hospital.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";
import { Sensor } from "../models/sensor.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";

const addPatient = asyncHandler(async (req, res) => {
  try {
    const { fullName, gender, age, sensor_id, aadhaar } = req.body;
    // if (
    //   [fullName, gender, age, sensor_id].some((field) => field?.trim() === "")
    // ) {
    //   throw new ApiError(400, "All fields are required");
    // }
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
  } catch (err) {
    throw new ApiError(500, `Something went wrong while adding patient ${err}`);
  }
});

const removePatient = asyncHandler(async (req, res) => {
  try {
    const { patient_id } = req.body;
    await Patient.deleteOne({ _id: patient_id });
    const hospital = await Hospital.findOne({
      user: req.user._id,
    });
    if (!hospital) {
      throw new ApiError(404, "Hospital not found");
    }
    hospital.patients.pull(patient_id);
    await hospital.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, {}, "Patient removed"));
  } catch (err) {
    throw new ApiError(500, "Something went wrong while removing patient");
  }
});
//tested
const addDoctor = asyncHandler(async (req, res) => {
  try {
    const { doctor_id } = req.body;
    // TODO: existing doctor check
    const hospital = await Hospital.findOne({
      user: req.user._id,
    });
    if (!hospital) {
      throw new ApiError(404, "Hospital not found");
    }
    console.log(req.body);
    if (!hospital.doctors.includes(doctor_id)) {
      hospital.doctors.push(doctor_id);
    } else {
      throw new ApiError(409, "Doctor already exists");
    }

    await hospital.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, hospital, "Doctor added successfully"));
  } catch (err) {
    throw new ApiError(500, `Something went wrong while adding doctor ${err}`);
  }
});
//tested
const removeDoctor = asyncHandler(async (req, res) => {
  try {
    const { doctor_id } = req.body;
    const hospital = await Hospital.findOne({
      user: req.user._id,
    });
    if (!hospital) {
      throw new ApiError(404, "Hospital not found");
    }
    console.log(hospital);
    hospital.doctors.pull(doctor_id);
    await hospital.save();
    return res
      .status(200)
      .json(new ApiResponse(200, hospital, "Doctor removed"));
  } catch (err) {
    throw new ApiError(500, "Something went wrong while removing doctor");
  }
});
const addSensor = asyncHandler(async (req, res) => {
  try {
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
  } catch (err) {
    throw new ApiError(500, "Something went wrong while adding sensor");
  }
});
// const removeSensor = asyncHandler(async (req, res) => {
//   try {
//     const { sensor_id } = req.body;
//     const hospital = await Hospital.findOne({
//       user: req.user._id,
//     });
//     if (!hospital) {
//       throw new ApiError(404, "Hospital not found");
//     }
//     hospital.sensors.pull(sensor_id);
//     await hospital.save({ validateBeforeSave: false });
//     return res.status(200);
//   } catch (err) {
//     throw new ApiError(500, "Something went wrong while removing sensor");
//   }
// });

const assignDoctor = asyncHandler(async (req, res) => {
  try {
    const { doctor_id, patient_id } = req.body;
    const patient = await Patient.findById(patient_id);
    if (!patient) {
      throw new ApiError(404, "Patient not found");
    }

    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) {
      throw new ApiError(404, "Doctor not found");
    }
    doctor.patients.push(patient_id);
    patient.doctors.push(doctor_id);
    await doctor.save({ validateBeforeSave: false });
    await patient.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, {}, "Doctor assigned"));
  } catch (err) {
    throw new ApiError(500, "Something went wrong while assigning doctor");
  }
});
const dismissDoctor = asyncHandler(async (req, res) => {
  try {
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
    await doctor.save({ validateBeforeSave: false });
    await patient.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, {}, "Doctor dismissed"));
  } catch (err) {
    throw new ApiError(500, "Something went wrong while dismissing doctor");
  }
});

export {
  addPatient,
  removePatient,
  addDoctor,
  removeDoctor,
  addSensor,
  // removeSensor,
  assignDoctor,
  dismissDoctor,
};
