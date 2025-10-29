import express from "express"
import {checkAuth,login,logout,register } from "../controllers/auth.controler.js";
import { authenticate } from "../middlewares/auth.middleware.js";




const router =express.Router();

// 1. REGISTER
router.post("/register",register)

// 2. LOGIN
router.post("/login",login)
// 3.LOGOUT 
router.post("/logout",logout)
// 4. CHECK
router.get("/check" , authenticate , checkAuth)

router.get("/get-submissions",authenticate,getSubmissions)
export default router;