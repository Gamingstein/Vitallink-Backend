# VitalLink - Backend Codebase

## Overview

**VitalLink** is an IoT-based health monitoring system that offers real-time patient health tracking for healthcare professionals. The backend of VitalLink handles the core functionalities of data collection, processing, and analytics for real-time patient health monitoring. This system captures vital signs like heart rate, oxygen levels, and body temperature from advanced sensors and transmits the data to healthcare providers for continuous monitoring.

VitalLink uses a scalable infrastructure built with modern web technologies to provide a seamless experience for both patients and doctors.

---

## Features

- **Real-Time Data Collection**: Integrates with sensors such as MAX30102 (pulse oximeter) and MLX90614ESF (non-contact temperature sensor) to gather vital signs.
- **Data Transmission**: ESP32 microcontroller transmits the sensor data to the backend server in real-time.
- **Analytics Dashboard**: Real-time data is processed and displayed via interactive dashboards built using React.js.
- **Remote Monitoring**: Enables healthcare professionals to monitor patients from remote locations, with alert systems for abnormal readings.
- **Predictive Health Analytics**: Utilizes historical data to provide early warnings based on trends and patterns.
- **Scalable Cloud Infrastructure**: Built on Node.js and MongoDB to handle multiple users and real-time data efficiently.

---

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [API Documentation](#api-documentation)
4. [Project Structure](#project-structure)
5. [Environment Variables](#environment-variables)
6. [Contributing](#contributing)
7. [License](#license)
8. [Contact](#contact)
9. [GitHub Repository](#github-repository)

---

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Gamingstein/Vitallink-Backend.git
   cd Vitallink-Backend
   ```

2. **Install Dependencies**

   Make sure you have [Node.js](https://nodejs.org/en/) installed on your machine.

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory and configure the following variables:

   ```bash
   PORT=8000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/vitallink
   CORS_ORIGIN=*
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d
   CLOUDINARY_CLOUD_NAME=vitallink
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the Server**

   ```bash
   npm start
   ```

   The backend will now be running on `http://localhost:8000`.

---

## Usage

1. **API Endpoints**: VitalLink provides several RESTful API endpoints for interacting with patient data, sensor data transmission, and user management.

2. **Sample API Call**: Below is an example of fetching real-time vitals for a specific patient.

   ```bash
   GET /api/v1/patients/:patientId/vitals
   ```

   Response:

   ```json
   {
     "patientId": "12345",
     "name": "John Doe",
     "heartRate": "72 bpm",
     "oxygenLevel": "98%",
     "bodyTemperature": "36.7°C",
     "timestamp": "2024-10-04T10:00:00Z"
   }
   ```

---

## API Documentation

| Endpoint                      | Method | Description                          |
| ----------------------------- | ------ | ------------------------------------ |
| `/api/v1/patients`            | GET    | Fetch all patients                   |
| `/api/v1/patients/:id`        | GET    | Fetch patient details by ID          |
| `/api/v1/patients/:id/vitals` | GET    | Fetch real-time vitals for a patient |
| `/api/v1/sensors/data`        | POST   | Submit real-time sensor data         |
| `/api/v1/alerts/:id`          | GET    | Fetch alert status for a patient     |

For a complete list of endpoints and detailed request/response formats, please visit our [API Documentation](#).

---

## Project Structure

```bash
├── src
│   ├── config          # Configuration files for database, authentication, etc.
│   ├── controllers     # Functions to handle API requests and responses
│   ├── models          # MongoDB schemas for patients, vitals, etc.
│   ├── routes          # Defines the API routes
│   ├── middleware      # Custom middleware for authentication and validation
│   ├── services        # Business logic and service-layer code
│   └── utils           # Utility functions and helpers
├── tests               # Unit and integration tests
├── .env                # Environment variables
├── package.json        # Project metadata and scripts
└── README.md           # Project documentation
```

---

## Environment Variables

- `PORT`: Defines the port the server will run on (default: 3000).
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT authentication.
- `CLOUDINARY_URL`: URL for Cloudinary for managing media assets.
- Add any other environment variables as required.

---

## Contributing

We welcome contributions from the community! To contribute to VitalLink:

1. Fork the repository.
2. Create a new feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a Pull Request.

Please read our [Contributing Guidelines](#) for more details.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---

## Contact

For any inquiries or support, please reach out to:

- **Name**: VitalLink Support Team
- **Email**: support@vitallink.com
- **LinkedIn**: [VitalLink on LinkedIn](#)

---

## GitHub Repository

For the full codebase, please visit our GitHub repository: [VitalLink Backend](https://github.com/yourusername/vitallink-backend)

---

Feel free to contribute or reach out if you have any questions or suggestions!

---
