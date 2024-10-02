import { Router } from "express";
import { verifyJWT } from "../middlewares/index.js";
import {
  addPatient,
  removePatient,
  getPatientsList,
  getPatientInfo,
} from "../controllers/doctor.controller.js";

const router = Router();

router.route("/add-patient").post(verifyJWT, addPatient);
router.route("/remove-patient").delete(verifyJWT, removePatient);
router.route("/patients").get(verifyJWT, getPatientsList);
router.route("/patient-info").get(verifyJWT, getPatientInfo);

export default router;
