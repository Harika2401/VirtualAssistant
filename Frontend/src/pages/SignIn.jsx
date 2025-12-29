import React, {useContext, useState} from "react";
import bg from "../assets/bg.jpg"
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import {useNavigate} from 'react-router-dom';
import { userDataContext } from "../context/userContext";
import axios from "axios"
function SignIn(){
  const [showPassword,setShowPassword]=useState(false)
  const {serverUrl,userData,setUserData} = useContext(userDataContext)
  const navigate=useNavigate()
  const[email,setEmail]=useState("")
  const[loading,setLoading]=useState(false)
  const[password,setPassword]=useState("")
  const[err,setErr]=useState("")
  const handleSignIn = async (e)=>{
    e.preventDefault()
    setErr("")
    setLoading(true)
    try {
      let result = await axios.post(
  "http://localhost:8000/api/auth/signin",
  { email: email,
    password: password },
  {withCredentials: true}
) 
setUserData(result.data)
setLoading(false)
navigate("/")
    } catch (err) {
      console.log("Signup Error:", err.response?.data || err.message)
      setUserData(null)
      setLoading(false)
      setErr(err.response.data.message)
    }
  }
  return(
    <div  className="w-full h-[100vh] bg-cover flex justify-center items-center" style={{backgroundImage:`url(${bg})`}}>
        <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]' onSubmit={handleSignIn}>
          <h1 className= 'text-white text-[30px] font-semibold mb-[30px]'> SignIn to <span className="text-blue-400">Virtual Assistant</span></h1>
          <input type="email" placeholder="Enter your email" className="w-full h-[60px] outline-none border-2 border-white bg-transparant text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]" required onChange={(e)=>setEmail(e.target.value)} value={email}/>
          <div className="w-full h-[60px] border-2 border-white bg-transparant text-white rounded-full text-[18px] relative">
            <input type={showPassword?"text":"password"} placeholder="password" className="w-full h-full rounded-full outline-none outline-none bg-transparant placeholder-gray-300 px-[20px] py-[10px]" required onChange={(e)=>setPassword(e.target.value)} value={password}/>
            {!showPassword && <FaEye className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white] cursor-pointer" onClick={()=>setShowPassword(true)}/>}
              {showPassword && <FaEyeSlash className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white] cursor-pointer" onClick={()=>setShowPassword(false)}/>}
          </div>
          {err.length>0 && <p className="text-red-500 text-[17px]">
            *{err}
            </p>}
          <button className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px]" disabled={loading}>{loading?"Loading...":"SignIn"}</button>
          <p className="text-[white] text-[18px] cursor-pointer"onClick={()=>navigate("/signup")}>Want to create a new account? <span className="text-blue-400">Sign Up</span></p>
        </form>
    </div>
  )
}

export default SignIn