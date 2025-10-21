import {db} from "../lib/db.js";
import { getJudge0LanguageId, submitBatch } from "../lib/judge0.js";

export const createProblem=async(req,res)=>{
  const {
    title,
    description,
    difficulty,
    tags,
    example,
    constraints,
    testCases,
    codeSnippets,
    redferenceSolutions,
    hints,
    editorials
  }=req.body;
  try{

    // 1. loop through each reference solution for different language 
    for(const [language,solutionCode] of Object.entries(redferenceSolutions)){
      // language id
      const languageId=getJudge0LanguageId(language);

      if(!languageId){
        return res.status(400).json({error: `Unsupported language : ${language}`})
      }

      // Prepare judge0 submission for all testcases 
      const submission=testCases.map(({input,output})=>({
        source_code:solutionCode,
        language_id:languageId,
        stdin:input,
        expected_output:output
      }))

      const submissionResults=await submitBatch(submission);
      const tokens=submissionResults.map((res)=>res.token);
      
    }

  }catch(error){
    
  }
}


export const getAllProblems=async(req,res)=>{}
export const getProblemById=async(req,res)=>{}
export const updateProblem=async(req,res)=>{}
export const deleteProblem=async(req,res)=>{}


{

}