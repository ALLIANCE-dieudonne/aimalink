import Router from "express"
import passport from "passport";
import { getAllDrives, searchDrive } from "../controllers/drivesController.js";

const router = Router();

router.get("/all_drives", passport.authenticate("jwt", { session: false }), getAllDrives);

router.post("/search_drive", passport.authenticate("jwt", { session: false }), searchDrive);

export default router;