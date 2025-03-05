import { Router } from "express";
import { storeFace } from "../controllers/storeFaceController.js";
import { upload } from "../utils/multer.js";

const router = Router();

router.post("/rapid-pass/:userId", upload.single("image"), storeFace);

export default router;
