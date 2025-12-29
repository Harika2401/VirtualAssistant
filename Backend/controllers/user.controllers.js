//gets the details of current user
import User from "../models/user.model.js"
import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../Gemini.js";
import moment from "moment";
export const getCurrentUser = async(req,res)=>{
    try {
    const { assistantName, imageUrl } = req.body;

    if (!assistantName) {
      return res.status(400).json({ message: "Assistant name is required" });
    }

    let assistantImage;

    if (req.file) {
      // ✅ ACTUAL upload
      const uploadResult = await uploadOnCloudinary(req.file.path);
      assistantImage = uploadResult;
    } else if (imageUrl) {
      assistantImage = imageUrl;
    } else {
      return res.status(400).json({ message: "Assistant image is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);

  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "update assistant error" });
  }
};
//to store the assistantimage in database so that it can go to backend easily*/}
export const updateAssistant=async(req,res)=>{
    try {
        const{assistantName,imageUrl}=req.body
        
        // this if is to store the customized image in database*/}
        
        let assistantImage;
        if(req.file)
        {
            assistantImage = uploadResult;//dont keep uploadResult.url if you write return uploadResult.secure_url in cloudinary.js
        }
         else {
            assistantImage =imageUrl;
        }

  
       //Else is to store the selected image from already available images*/}
        //The below code is used to update the user data whenevr he changes and remove the password new:true says to update and select(-password) removes the password */}
        const user=await User.findByIdAndUpdate(req.userId,{
            assistantName,assistantImage
        },{new:true}).select("-password")
      
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({message:"update assistant error"})
    }
}
export const askToAssistant=async(req,res)=>{
    try {
        //call gemini for response
        const {command}=req.body
        //take username,asst name from db
        const user=await User.findById(req.userId);
        user.history.push(command)
        user.save()
        const userName=user.name
        const assistantName=user.assistantName
        //get result from gemini
        const result=await geminiResponse(command,userName,assistantName)

        const jsonMatch=result.match(/{[\s\S]*}/)
        if(!jsonMatch){
            return res.status(400).json({response:"Sorry, I can't understand"})
        }
        const gemResult=JSON.parse(jsonMatch[0])
        console.log(gemResult)
        const type=gemResult.type
        switch(type){
            case 'get_date':
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response:`current date is ${moment().format("YYYY-MM-DD")}`
                });
            case 'get_time':
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response:`current time is ${moment().format("hh:mm:A")}`
                });
            case 'get_day':
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response:`today is ${moment().format("dddd")}`
                });
            case 'get_month':
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response:`month is ${moment().format("MMM")}`
                });
            case "youtube_search":
            case "youtube_play":
            case "general":
            case "calculator_open":
            case "instagram_open":
            case "facebook_open":
            case "weather_show":
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response:gemResult.response,
                });
            default:
                return res.status(400).json({response:"I don't understand that command."})

        }

        
    } catch (error) {
        return res.status(500).json({response:"ask assistant error"})
    }
}
