import mongoose, { Schema } from "mongoose";

const sensorDataSchema = new Schema(
  {
    timestamp: {
      type: Date,
      required: true,
    },
    sensorData: {
      temp: {
        type: Number,
        default: 0,
      },
      spo2: {
        type: Number,
        default: 0,
      },
      heartrate: {
        type: Number,
        default: 0,
      },
    },
    sensorID: {
      type: String,
      required: true,
    },
  },
  {
    timeseries: {
      timeField: "timestamp",
      metaField: "sensorID",
      granularity: "hours",
    },
    expireAfterSeconds: 36000,
  },
);

export const SensorData = mongoose.model("SensorData", sensorDataSchema);
