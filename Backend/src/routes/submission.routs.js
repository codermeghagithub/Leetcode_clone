import express from "express";
import {authenticate} from "../middlewares/auth.middleware.js";
import {getSubmissionsForProblemorProblem, getAllTheSubmissionsForProblem, getAllSubmissions } from "../controllers/submission.controler.js";

const router=express.Router();
router.get("/get-all-submissions",authenticate,getAllSubmissions);

router.get("/get-submissions/:problem,",authenticate,getSubmissionsForProblemorProblem);

router.get("/get-submissions-count/:problemId",authenticate,getAllTheSubmissionsForProblem)