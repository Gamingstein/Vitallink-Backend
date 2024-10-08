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

/*

       *Dummy Data*
[
  {
    "timestamp": "2024-10-08T11:00:00Z",
    "sensorData": { "temp": 36.5, "spo2": 98, "heartrate": 75 },
    "patientId": "65234abc1234abcd56789ef0",
    "sensorID": "sensor001"
  },
  {
    "timestamp": "2024-10-08T12:00:00Z",
    "sensorData": { "temp": 36.7, "spo2": 97, "heartrate": 76 },
    "patientId": "65234abc1234abcd56789ef0",
    "sensorID": "sensor001"
  },
  {
    "timestamp": "2024-10-08T12:00:00Z",
    "sensorData": { "temp": 37.1, "spo2": 96, "heartrate": 78 },
    "patientId": "65234abc1234abcd56789ef0",
    "sensorID": "sensor002"
  },
  {
    "timestamp": "2024-10-08T13:00:00Z",
    "sensorData": { "temp": 36.9, "spo2": 99, "heartrate": 72 },
    "patientId": "65234abc1234abcd56789ef1",
    "sensorID": "sensor003"
  },
  {
    "timestamp": "2024-10-08T14:00:00Z",
    "sensorData": { "temp": 36.8, "spo2": 95, "heartrate": 80 },
    "patientId": "65234abc1234abcd56789ef2",
    "sensorID": "sensor004"
  },
  {
    "timestamp": "2024-10-08T15:00:00Z",
    "sensorData": { "temp": 37.0, "spo2": 97, "heartrate": 74 },
    "patientId": "65234abc1234abcd56789ef2",
    "sensorID": "sensor004"
  },
  {
    "timestamp": "2024-10-08T16:00:00Z",
    "sensorData": { "temp": 37.2, "spo2": 96, "heartrate": 77 },
    "patientId": "65234abc1234abcd56789ef3",
    "sensorID": "sensor005"
  },
  {
    "timestamp": "2024-10-08T17:00:00Z",
    "sensorData": { "temp": 36.6, "spo2": 98, "heartrate": 73 },
    "patientId": "65234abc1234abcd56789ef3",
    "sensorID": "sensor005"
  },
  {
    "timestamp": "2024-10-08T18:00:00Z",
    "sensorData": { "temp": 36.5, "spo2": 99, "heartrate": 71 },
    "patientId": "65234abc1234abcd56789ef4",
    "sensorID": "sensor006"
  },
  {
    "timestamp": "2024-10-08T19:00:00Z",
    "sensorData": { "temp": 36.9, "spo2": 96, "heartrate": 79 },
    "patientId": "65234abc1234abcd56789ef5",
    "sensorID": "sensor007"
  }
]



*/
