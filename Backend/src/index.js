import express from "express";
import dotenv from "dotenv"

dotenv.config()
const app=express();

// ** Middlewares

app.use(express.json())

const PORT=process.env.PORT || 8080
app.get("/",(req,res)=>{
res.json({
  success:true,
  message:"Welcome to our Leetcode Clone API"
})
})


app.listen(PORT,()=>{
  console.log(`your server is running on port http://localhost:${PORT}`);
  
})