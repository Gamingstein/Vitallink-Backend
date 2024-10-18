import mongoose, { Schema } from "mongoose";

const hospitalSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    doctors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Doctor",
      },
      { default: [] },
    ],
    patients: [
      {
        type: Schema.Types.ObjectId,
        ref: "Patient",
      },
      { default: [] },
    ],
    sensors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Sensor",
      },
      { default: [] },
    ],
  },
  {
    timestamps: true,
  },
);

export const Hospital = mongoose.model("Hospital", hospitalSchema);
