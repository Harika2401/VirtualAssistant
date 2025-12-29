import React, { useContext, useState } from "react"
import { userDataContext } from "../context/UserContext"
import axios from "axios"
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function Customize2(){
    const {userData,backendImage,selectedImage,serverUrl,setUserData}=useContext(userDataContext)
    const [assistantName,setAssistantName]=useState(userData?.assistantName || "")

    const [loading,setLoading]=useState(false)
    const navigate=useNavigate()
    const handleUpdateAssistant=async()=>{
        setLoading(true)
        try {
            {/*Images can't be sent to backend just by writing the code here so we have to use forms for that */}
            {/*Let us create formdata to get the images, formdata is a class in js and now we have create object for this class */}
            const formData=new FormData()
            formData.append("assistantName",assistantName)
            if(backendImage){
                formData.append("assistantImage",backendImage)
            }else if (selectedImage){
                formData.append("imageUrl",selectedImage)
            }
            console.log("backendImage:", backendImage);
            console.log("selectedImage:", selectedImage);
            const result=await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true, })
            setLoading(false)
            console.log(result.data)
            setUserData(result.data)
            navigate("/")
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }
    
    return(
        
        <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative">
            <IoMdArrowRoundBack className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer" onClick={()=>navigate("/customize")}/>
            <h1 className="text-white mb-[30px] text-[30px] text-center">Enter Your <span className="text-blue-200">Assistant Name</span></h1>
            <input type="text" placeholder="eg: Sifra" className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparant text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]" required onChange={(e)=> setAssistantName(e.target.value)} value={assistantName}/>
            {/*view button only when assistant name is written */}
            {assistantName && <button className="min-w-[300px] h-[60px] mt-[30px] cursor-pointer text-black font-semibold bg-white rounded-full text-[19px]" disabled={loading} onClick={()=>handleUpdateAssistant()}>{!loading?"Finally Create Your Assistant":"Loading..."}</button>}
            
        </div>
    )
}

export  default Customize2
