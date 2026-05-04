require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-flash-latest",
            tools: [{
                functionDeclarations: [{
                    name: "get_weather",
                    description: "Get the weather",
                    parameters: { type: "OBJECT", properties: { location: { type: "STRING" } } }
                }]
            }],
            systemInstruction: "You are a weather bot."
        });
        const chat = model.startChat();
        const result = await chat.sendMessage("What is the weather in Paris?");
        console.log("Success:", result.response.functionCalls());
    } catch (e) {
        console.error("Error:", e.message, e);
    }
}
test();
