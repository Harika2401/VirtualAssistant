import axios from "axios"

const geminiResponse = async (command, userName, assistantName) => {
    try {
        // Check if API URL is configured
        const apiUrl = process.env.GEMINI_API_URL;
        
        if (!apiUrl) {
            console.error("GEMINI_API_URL is not set in environment variables");
            throw new Error("Gemini API URL not configured");
        }

        console.log("Gemini API URL:", apiUrl.replace(/key=.*/, 'key=***')); // Log URL without exposing key

        const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}. 
You are not Google. You will now behave like a voice-enabled assistant.

Your task is to understand the user's natural language input and respond with a strict JSON object only like this:

{
  "intent": "chat" | "command",
  "type": null || "general" | "google_search" | "youtube_search" | "youtube_play" |
          "get_time" | "get_date" | "get_day" | "get_month" |
          "calculator_open" | "instagram_open" | "facebook_open" | "weather_show",
  "userInput": "<original user input>",
  "response": "<a short spoken response to read out loud to the user>"
}

Instructions:
- "type": determine the intent of the user.
- "userInput": For google_search or youtube_search, extract only the search query text without trigger words.
  Example: "search google for weather" -> userInput should be "weather"
  Example: "play song on youtube" -> userInput should be "song"
- "response": a short voice-friendly reply like:
  "Sure", "Here's what I found", "Today is Tuesday", etc.

Type meanings:
- "general": if it is a factual or informational question aur agar koi aisa question puchta hai jiska answer tume pata hai usko bhi general ki category me rakho bas .
- "google_search": user wants to search something on Google.
- "youtube_search": user wants to search something on YouTube.
- "youtube_play": user wants to directly play a video or song.
- "calculator_open": user wants to open calculator.
- "instagram_open": user wants to open Instagram.
- "facebook_open": user wants to open Facebook.
- "weather_show": user wants to know weather.
- "get_time": user asks current time.
- "get_date": user asks today's date.
- "get_day": user asks what day it is.
- "get_month": user asks current month.

Important:
- Use ${userName} if the user asks who created you.
- Only respond with the JSON object.
- Do NOT add explanations, markdown formatting, or extra text.
- Return ONLY valid JSON.

Now the user input is:
"${command}"
`;

        console.log("Sending request to Gemini...");
        
        const result = await axios.post(
            apiUrl,
            {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 second timeout
            }
        );

        console.log("Gemini API response received");
        
        // Check if response has expected structure
        if (!result.data || !result.data.candidates || result.data.candidates.length === 0) {
            console.error("Unexpected Gemini response structure:", result.data);
            throw new Error("Invalid response from Gemini API");
        }

        const responseText = result.data.candidates[0].content.parts[0].text;
        console.log("Gemini response text:", responseText);
        
        return responseText;

    } catch (error) {
        console.error("Gemini API Error:");
        console.error("Error message:", error.message);
        
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received from Gemini API");
            console.error("Request details:", error.request);
        } else {
            // Something happened in setting up the request
            console.error("Error setting up request:", error.message);
        }
        
        throw error; // Re-throw to be caught by controller
    }
}

export default geminiResponse;