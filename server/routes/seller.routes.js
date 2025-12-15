import express from "express";
import {sellerLogin,sellerLogout,isAuthSeller} from "../controllers/seller.controller.js";
import {authSeller} from "../middlewares/authSeller.js";

const router=express.Router();

router.post("/login",sellerLogin);
router.get("/is-auth",authSeller,isAuthSeller);
router.get("/logout",authSeller,sellerLogout);

export default router;

