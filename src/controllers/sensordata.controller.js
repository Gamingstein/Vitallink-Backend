import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { SensorData } from "../models/sensordata.model.js";

const addSensorData = asyncHandler(async (req, res) => {
  const { data } = req.body;
  if (!data) {
    throw new ApiError(400, "Data is required");
  }
  const insertedData = await SensorData.insertMany(data);
  return res
    .status(200)
    .json(new ApiResponse(200, insertedData, "Data added successfully"));
});

const getSensorData = asyncHandler(async (req, res) => {
  const { sensorID } = req.body;
  if (!sensorID) {
    throw new ApiError(400, "Sensor ID is required");
  }

  const sensorData = await SensorData.find({ sensorID });
  if (!sensorData) {
    throw new ApiError(404, "Sensor data not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, sensorData, "Sensor data fetched successfully"));
});

export { addSensorData, getSensorData };
