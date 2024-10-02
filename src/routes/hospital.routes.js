import { Router } from "express";
import { verifyJWT } from "../middlewares/index.js";
import {
  addPatient,
  removePatient,
  addDoctor,
  removeDoctor,
  addSensor,
  // removeSensor,
  assignDoctor,
  dismissDoctor,
} from "../controllers/hospital.controller.js";

const router = Router();

//tested
router.route("/add-patient").post(verifyJWT, addPatient);
router.route("/remove-patient").delete(verifyJWT, removePatient);
router.route("/add-doctor").post(verifyJWT, addDoctor);
router.route("/remove-doctor").delete(verifyJWT, removeDoctor);
router.route("/add-sensor").post(verifyJWT, addSensor);

// router.route("/remove-sensor").delete(verifyJWT, removeSensor);
//
router.route("/assign-doctor").post(verifyJWT, assignDoctor);
router.route("/dismiss-doctor").delete(verifyJWT, dismissDoctor);

export default router;
