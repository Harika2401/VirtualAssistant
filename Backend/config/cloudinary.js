import { v2 as cloudinary } from 'cloudinary';//imported from cloudinary
import fs from "fs"
const uploadOnCloudinary=async(filePath)=>{
     cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    try {
        const uploadResult = await cloudinary.uploader
       .upload(filePath)
       fs.unlinkSync(filePath) //is used to delete the file from your server (locally stored file) after it has been successfully uploaded to Cloudinary to save the space in our local server.
       return uploadResult.secure_url
    } catch (error) {
        fs.unlinkSync(filePath)
        console.log("Cloudinary error:", error);
        return null;
    }
}

export default uploadOnCloudinary