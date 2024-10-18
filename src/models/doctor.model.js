import mongoose, { Schema } from "mongoose";

const doctorSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    gender: {
      type: String,
      enum: ["female", "male", "other"],
      required: true,
    },
    specification: {
      type: String,
      required: true,
      trim: true,
    },
    patients: [
      {
        type: Schema.Types.ObjectId,
        ref: "Patient",
      },
      { default: [] },
    ],
    hospitals: [
      {
        type: Schema.Types.ObjectId,
        ref: "Hospital",
      },
      { default: [] },
    ],
  },
  {
    timestamps: true,
  },
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
