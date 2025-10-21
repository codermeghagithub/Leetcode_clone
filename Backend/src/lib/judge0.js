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



export async function submitBatch(submission){
  const {data}=await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encode=false`,
    {submission},
    {
      Headers:{
        "x-rapidapi-key":process.env.RAPIDAPI_KEY,
        "x-rapidapi-host":process.env.RAPIDAPI_HOST,
      },
    }

    
  );
  return data;
}



export async function pollBatchResults(tokens){
      const {data}=await axios.get(
        `${process.env.JUDGE0_API_URL}/submissions/batch`,
        {
          params:{
            tokens:tokens.join(","),
            base64_encoded:false,

          }
        }
      )

      const results=data.submissions;
      const isAllDone=results.every(
        (r)=>r.status.id !==1 && r.status!==2
      );

    }


    // every =>all values true => true  && 
    // Some => if one condition is true it gives => tru