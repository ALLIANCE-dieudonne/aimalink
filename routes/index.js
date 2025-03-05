import { Router } from "express";
import authRouter from "./auth.js";
import scheduleDonationRouter from "./donation.js";
import faceDetectionRouter from "./rapidpass_facerecognition.js";
import rapidpassRouter from "./rapidpass.js";
import drivesRouter from "./drives.js";

const router = Router();

router.use(authRouter);
router.use(scheduleDonationRouter);
router.use(faceDetectionRouter);
router.use(rapidpassRouter);
router.use(drivesRouter)
export default router;
