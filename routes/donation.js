import { Router } from "express";
import passport from "passport";
import { scheduleDonation, getAllDrives, getAllSchedules, searchDrive } from "../controllers/donationController.js";
import { checkSchema } from "express-validator";
import { scheduleDonationValidation } from "../validation/donationValidationSchema.js";

const router = Router();

router.post(
  "/schedule_donation",
  passport.authenticate("jwt", { session: false }),
  scheduleDonation
);

router.get("/all_schedules", passport.authenticate("jwt", { session: false }), getAllSchedules);

router.get("/all_drives", passport.authenticate("jwt", { session: false }), getAllDrives);

router.post("/search_drive", passport.authenticate("jwt", { session: false }), searchDrive);

export default router;
