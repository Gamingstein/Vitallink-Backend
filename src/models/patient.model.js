import mongoose, { Schema } from "mongoose";

const patientSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    aadhaar: {
      type: Number,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["female", "male", "other"],
    },
    age: {
      type: Number,
      required: true,
    },
    admitted: {
      type: Boolean,
      required: true,
    },
    sensor_id: {
      type: Schema.Types.ObjectId,
      ref: "Sensor",
      required: true,
    },
    doctors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Doctor",
      },
    ],
    hospital_id: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Patient = mongoose.model("Patient", patientSchema);
