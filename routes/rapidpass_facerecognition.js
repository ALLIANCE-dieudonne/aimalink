import { Router } from "express";
import {storeFace} from "../controllers/storeFaceController.js"

const router = Router();


router.post("/rapid-pass/:userId", storeFace)

export default router;