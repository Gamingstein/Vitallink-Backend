import mongoose, { Schema } from "mongoose";

const hospitalSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    doctors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Doctor",
      },
    ],
    patients: [
      {
        type: Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
    sensors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Sensor",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Hospital = mongoose.model("Hospital", hospitalSchema);
