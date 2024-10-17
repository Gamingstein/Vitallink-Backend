import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectGraphQL } from "./graphql/index.js";
import { expressMiddleware } from "@apollo/server/express4";

const app = express();
const graphqlServer = connectGraphQL();
await graphqlServer.start();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//GraphQL
app.use("/graphql", expressMiddleware(graphqlServer));

//routes import
import userRouter from "./routes/user.routes.js";
import doctorRouter from "./routes/doctor.routes.js";
import hospitalRouter from "./routes/hospital.routes.js";
import sensorDataRouter from "./routes/sensordata.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/hospital", hospitalRouter);
app.use("/api/v1/sensor", sensorDataRouter);

// http://localhost:8000/api/v1/users/register

export { app };
