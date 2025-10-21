import express from "express";
import {authenticate,checkAdmin} from "../middlewares/auth.middleware.js"
import { getAllProblems, getProblemById } from "../controllers/problem.controler.js";
const router=express.Router();


router.post("/create-problem",authenticate,checkAdmin,createProblem)

router.get("/get-all-Problems",authenticate,getAllProblems)
router.get("/get-problem/:id",getProblemById);
router.put("/problem-update/:id",authenticate,checkAdmin,updateProblem);
router.delete("/delete-problem:/id",authenticate,checkAdmin,deleteProblem)
export default router;