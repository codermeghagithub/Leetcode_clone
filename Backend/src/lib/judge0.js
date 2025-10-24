import axios from "axios";
import dotenv from "dotenv"

dotenv.config();

export function getJudge0LanguageId(Language){
  const languageMap={
    PYTHON:71,
    JAVA:62,
    CPP:54,
    JAVASCRIPT:63,
    GO:60
  };
  return languageMap[Language.toUpperCase()]
}



export async function submitBatch(submissions){
  const {data}=await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false&wait=false`,
    {submissions},
    {
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": process.env.RAPIDAPI_HOST,
        },
    }

    
  );
  return data;
}

export const sleep=(ms)=>new Promise((resolve)=>setTimeout(resolve,ms))


export async function pollBatchResults(tokens){
    while(true){const {data}=await axios.get(
        `${process.env.JUDGE0_API_URL}/submissions/batch`,
        {
          params:{
            tokens:tokens.join(","),
            base64_encoded:false,

          },
             headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": process.env.RAPIDAPI_HOST,
        },
        }
      )

      const results=data.submissions;
      const isAllDone=results.every(
        (r)=>r.status.id !==1 && r.status.id!==2 // ** chacking for done in judge0 info 2<status{accepted,error,etc}
      );
       if(isAllDone) return results;
         await sleep(1000)
      
      }
    }

    // every =>all values true => true  && 
    // Some => if one condition is true it gives => tru