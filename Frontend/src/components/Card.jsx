import React, {useContext, useState} from "react";
import { userDataContext } from "../context/userContext";

function Card({image}){
 const{serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage}=useContext(userDataContext)
  return(
    <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${selectedImage==image?"border-4  border-white shadow-2xl shadow-blue-950":null}`} onClick={()=>
      /*  ${selectedImage==image?"border-4  border-white shadow-2xl shadow-blue-950":null
          this is to make the border and shadow permanent when clicked on image to make it look like it is selected!!! */
      {setSelectedImage(image)
      setBackendImage(null)
      setFrontendImage(null)}
      }>
        
        <img src={image} className='h-full object-cover' />
    </div>
    /* to add image */
  )
}

export default Card