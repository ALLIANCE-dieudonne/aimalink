import { Router } from "express";
import { deleteUser, getAllUsers, getUser, updateUser } from "../controllers/userController.js";
import passport from "passport";

const router = Router();

router.get("/all_users", passport.authenticate("jwt", {session: false}), getAllUsers);
router.get("/user", passport.authenticate("jwt", {session: false}), getUser);
router.put("/update_user", passport.authenticate("jwt", {session: false}),updateUser);
router.delete("/delete_user", passport.authenticate("jwt", {session:false}),deleteUser);

export default router;