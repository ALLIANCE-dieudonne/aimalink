import { Router } from "express";
import passport from "passport";
import {
  scheduleDonation,
  getAllSchedules,
  rescheduleDonation,
  cancelDonation
} from "../controllers/donationController.js";
import { checkSchema } from "express-validator";
import { scheduleDonationValidation } from "../validation/DonationValidationSchema.js";

const router = Router();

router.post(
  "/schedule_Donation",
  passport.authenticate("jwt", { session: false }),
  scheduleDonation
);

router.get(
  "/all_schedules",
  passport.authenticate("jwt", { session: false }),
  getAllSchedules
);

router.put(
  "/reschedule_donation/:donationId",
  passport.authenticate("jwt", { session: false }),
  rescheduleDonation
);

router.delete("/cancel_donation/:donationId", passport.authenticate("jwt", {session: false}),cancelDonation)

export default router;
