import express from "express"
import dotenv from "dotenv"
dotenv.config()//calling config() func from .env so that we can access env variables in .env
import connectDb from "./config/db.js"
import authRouter from "./Routers/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./Routers/user.routes.js"
import geminiResponse from "./Gemini.js"
dotenv.config();
//create server
//intialize express 
const app = express() //means all methods and functions of express can be used through "app"
//before this step create .env file

app.use(cors({
    origin:"https://virtualassistant-frontend-a42s.onrender.com",
    credentials:true
}))
// ✅ BODY PARSERS — MUST COME FIRST
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//cookies
app.use(cookieParser())
//static files
app.use("/public", express.static("public"))
//middleware

//routes
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
/*app.get("/",(req,res)=>{
    res.send("hi")
})//server is created 
//but this is not a controller it  is just handler we need router and all so it is not the coorect process to create server
//listen to the server*/
const port= process.env.PORT || 8000//accessing PORT from .env and if there is no PORT in .env then defaultly uses 5000
//the below part is temporary
/*app.get("/",async (req,res)=>{
    let prompt=req.query.prompt
   let data=await geminiResponse(prompt)
   res.json(data)
})*/
//after writing this go to google and paste this [localhost:8000/?prompt="who are you"] and select pretty-print there you can see the response from gemini saying that "I am a large..."


app.listen(port,()=>{
    connectDb()//connect to the database in db.js
    console.log("server started",port)//will be printed in consol
})
