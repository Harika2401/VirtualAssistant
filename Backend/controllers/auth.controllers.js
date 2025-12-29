import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
export const signup = async(req,res)=>{
    console.log("REQ BODY:", req.body)
    try{
        const {name,email,password} = req.body
        //check if the user is already there or not
        const existEmail=await User.findOne({email})
        if(existEmail)
        {
            return res.status(400).json({message:"email already exists"})
        }
        if(password.length<6)
        {
            return res.status(400).json({message:"password must be atleast 6 characters"})
        }
        //password is stores in hash 
        const hashedPassword = await bcrypt.hash(password,10)
        //In bcrypt, the salt is NOT a string. It's the number of rounds (cost factor).Here 10 is NOT a salt string — it's the salt rounds.
        //What are salt rounds?
        //Salt rounds = how many times bcrypt will process the password.
            //Default: 10
            //More rounds → more secure → but slower


        //create user
        const user = await User.create({
            name,password:hashedPassword,email
        })
        //generate token
        
        const token = await genToken(user._id)//if there is any user model (created user) then mongo db will create the id for it automatically
        //got genToken from token.js
        //parsing token in cookies
        res.cookie("token",token,{
            //write the methods
            httpOnly:true,
            maxAge:7*24*60*60*1000,//how much time should the token stored (here 7days)
            sameSite:"laxm",
            secure:false, //we are using http so make it false
        }) //token is the cookie name which we have created to store all the tokens

        //send to user
        return res.status(201).json(user)
    }catch(error){
        return res.status(500).json({message:`sign up error ${error}`})
    }
}
export const Login = async(req,res)=>{
    try{
        const {email,password} = req.body
        //check if the user is already there or not
        const user=await User.findOne({email})
        if(!user)
        {
            return res.status(400).json({message:"email doesn't exists"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        
        if(!isMatch)
        {
            return res.status(400).json({message:"incorrect password"})
        }
        const token = await genToken(user._id)//if there is any user model (created user) then mongo db will create the id for it automatically
        //got genToken from token.js
        //parsing token in cookies
        res.cookie("token",token,{
            //write the methods
            httpOnly:true,
            maxAge:7*24*60*1000,//how much time should the token stored (here 7days)
            sameSite:"strict",
            secure:false //we are using http so make it false
        }) //token is the cookie name which we have created to store all the tokens

        //send to user
        return res.status(200).json(user)
    }catch(error){
        return res.status(500).json({message:`login error ${error}`})
    }
}

export const logOut = async(req,res)=>{
    try{
        //take the token from cookie
        res.clearCookie("token", { httpOnly: true, sameSite: "strict", secure: false })
        return res.status(201).json({message:`Logout Successfull`})
    }catch(error)
    {
        return res.status(201).json({message:`logout error ${error}`})
    }
}