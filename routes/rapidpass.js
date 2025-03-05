import { Router } from "express";
import {rapidpass} from "../controllers/rapidpassController.js"
import passport from "passport";

const router = Router();

router.post("/rapid-pass", passport.authenticate("jwt", { session: false }),rapidpass);

export default router;
