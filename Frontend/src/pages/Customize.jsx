import React, {useContext, useRef, useState} from "react";
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.png"
import image3 from "../assets/image3.png"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.png"
import image7 from "../assets/image7.png"
import Card from "../components/Card";
import { LuImagePlus } from "react-icons/lu";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
function Customize(){
  const{serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage}=useContext(userDataContext)
  const navigate = useNavigate()
  const inputImage=useRef()
  const handleImage=(e)=>{
    const file=e.target.files[0]
    if (!file) return;
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
    setSelectedImage("input");
  } 
  return (
     <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px]">
        <IoMdArrowRoundBack className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer" onClick={()=>navigate("/")}/>
        <h1 className="text-white mb-[30px] text-[30px] text-center">Select your <span className="text-blue-200"> Assistant Image </span></h1>
        <div className="w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]">
        <Card image={image1}/>
        <Card image={image2}/>
        <Card image={image3}/>
        <Card image={image4}/>
        <Card image={image5}/>
        <Card image={image6}/>
        <Card image={image7}/>
        <div
  className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px]
  bg-[#020220] border-2 border-[#0000ff66] rounded-2xl
  overflow-hidden cursor-pointer flex items-center justify-center
  hover:shadow-2xl hover:shadow-blue-950 hover:border-4 hover:border-white
  ${selectedImage === "input"
    ? "border-4 border-white shadow-2xl shadow-blue-950"
    : ""}`}
  onClick={() => {
    if (!frontendImage) {
      inputImage.current.click();
    }
    setSelectedImage("input");
  }}
>
  {!frontendImage && (
    <LuImagePlus className="text-white w-[25px] h-[25px]" />
  )}
  {frontendImage && (
    <img src={frontendImage} className="h-full object-cover" />
  )}
</div>

       
        </div>
        <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
        {selectedImage && <button className="min-w-[150px] h-[60px] mt-[30px] cursor-pointer text-black font-semibold bg-white rounded-full text-[19px]" onClick={()=>navigate("/customize2")}>Next</button>}
        
    </div>
  );
}

export default Customize