import mongoose, { Schema } from "mongoose";

const timeSeriesDataSchema = new Schema({
  timestamp: { type: Date, required: true },
  value: { type: Number, required: true },
  _id: false,
});
const sensorSchema = new Schema({
  hospital_id: {
    type: Schema.Types.ObjectId,
    ref: "Hospital",
    required: true,
  },
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
  },
  heart_rate: { type: [timeSeriesDataSchema], default: [] },
  spo2: { type: [timeSeriesDataSchema], default: [] },
  temperature: { type: [timeSeriesDataSchema], default: [] },
});

export const Sensor = mongoose.model("Sensor", sensorSchema);
