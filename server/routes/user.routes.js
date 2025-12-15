import express from "express";
import {registerUser,loginUser,logoutUser,isAuthUser, uploadAvatar} from "../controllers/user.controller.js";
import {authUser} from "../middlewares/authUser.js";
import { upload } from "../config/multer.js";

const router=express.Router();
  
 router.post("/register",registerUser);
 router.post("/login",loginUser);
router.get("/logout",authUser,logoutUser);
router.get("/is-auth",authUser,isAuthUser);
router.post("/avatar", authUser, upload.single("avatar"), uploadAvatar);


export default router;

