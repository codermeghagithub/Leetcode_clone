import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { db } from "../lib/db.js";
import { UserRole } from "../generated/prisma/index.js";

export const register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // *JWT secret creation
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({
        error: "user already exist",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        email,
        password: hashPassword,
        name,
        role: UserRole.USER,
      },
    });
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      samesite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      message: "user registred successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        image: newUser?.image,
      }
    });
  } catch (error) {
      console.error("Register error:", error);
  res.status(400).json({ error: error.message, details: error });
  }
};



export const login = async (req, res) => {
  const {email,password}=req.body;
  try{
    const user=await db.user.findUnique({where:{email}})

    if(!user){
      return res.status(404).json({error:"User not found"})
    }
    const isMatch=await bcrypt.compare(password,user.password)

    if(!isMatch){
      return res.status(401).json({error:"Invalid credentials"})
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      samesite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "user login successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user?.image,
      }
    });
  }catch(error){
    console.error("Login Error:",error);
    res.status(500).json({error:"Login failed"})

  }
};
export const logout = async (req, res) => {
  try{
    res.clearCookie("jwt",{
      httpOnlytrue,
      samesite:"strict",
      secure:process.env.NODE_ENV !=="development",
    })
    res.status(200).json({success:true,message:"Logout successful"})
  }catch(error){
    console.error("Logout Error:",error);
    res.status(500).json({error:"Failed to log out"})
  }
};



export const checkAuth = async (req, res) => {
  try {
    
    res.status(200).json({
      success:true,
      message:"User suthenticated successfully",
      user:req.user
    });
  } catch (error) {
    console.error("Auth Check Error:",error);
    res.status(500).json({error:"Failed to check authentication"})
  }
};


export const getSubmissions=async(req,res)=>{
  try {
    const submissions=await db.submission.findMany({
    where:{
      userId:req.user.id,
    }
  });
  res.status(200).json({
    success:true,
    message:"Submissions fetched successfully",
    submissions,
  })
}catch(err){
  console.error("Fetch submissions Error",err);
  res.status(500).json({error:"Failed to fetch submissions"})
  
}
}

