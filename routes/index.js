import { Router } from "express";
import authRouter from "./auth.js";
import scheduleDonationRouter from "./donation.js";
import faceDetectionRouter from "./rapidpass_facerecognition.js";

const router = Router();

router.use(authRouter);
router.use(scheduleDonationRouter);
router.use(faceDetectionRouter)
export default router;
