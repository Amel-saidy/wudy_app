const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');

const handleChat = async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "Gemini API key is missing from server configuration." });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        const getProductsFunctionDeclaration = {
            name: "get_products",
            description: "Get a list of available products in the shop. Can be filtered by category or name.",
            parameters: {
                type: "OBJECT",
                properties: {
                    category: {
                        type: "STRING",
                        description: "Optional. Filter by product category (e.g. dress, suit, traditional)"
                    },
                    searchQuery: {
                        type: "STRING",
                        description: "Optional. Search query for product name or description"
                    }
                }
            }
        };

        const tools = [{
            functionDeclarations: [getProductsFunctionDeclaration]
        }];

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            tools: tools,
            systemInstruction: "You are WeydiBot, a friendly and helpful AI shopping assistant for Weydi Creation. You help customers find clothing, tell them prices, and assist them. All prices are in Gambian Dalasi (D). Always format prices as 'D X,XXX'. You must use the get_products tool to look up product information when the user asks about what is available, prices, or specific items. Available categories are 'Men' and 'Women'. If the user asks for 'dresses', they are likely in the 'Women' category or search for 'dress' in the name. If the user asks something completely unrelated to shopping, tailoring, or Weydi Creation, politely redirect them. Keep your answers concise and conversational. Do not make up products or prices. Only recommend what the tool returns. If you suggest a product, include its exact name so the frontend can display it."
        });

        const { message, history } = req.body;
        
        // Convert history format to Gemini format
        let formattedHistory = history && Array.isArray(history) ? history.map(msg => ({
            role: msg.role === 'ai' ? 'model' : 'user',
            parts: [{ text: msg.text || "" }]
        })) : [];

        // Gemini requires history to start with a 'user' message.
        // Remove leading 'model' messages (like the initial greeting).
        while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
            formattedHistory.shift();
        }

        console.log("Sending to Gemini - Message:", message);
        console.log("History Length:", formattedHistory.length);

        const chat = model.startChat({
            history: formattedHistory,
        });

        let result;
        let retries = 3;
        while (retries > 0) {
            try {
                result = await chat.sendMessage(message);
                break;
            } catch (err) {
                if ((err.status === 503 || err.status === 500) && retries > 1) {
                    console.log(`Gemini 503/500 error, retrying... (${retries-1} left)`);
                    retries--;
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    throw err;
                }
            }
        }
        let response = result.response;
        let suggestedProducts = [];
        
        // Check if the model wants to call a function
        const functionCalls = response.functionCalls();
        
        if (functionCalls && functionCalls.length > 0) {
            const call = functionCalls[0];
            if (call.name === "get_products") {
                const { category, searchQuery } = call.args;
                
                let query = {};
                if (category) {
                    // Try to match category, or search for it in the name if it's not a standard category
                    if (['Men', 'Women'].includes(category)) {
                        query.category = category;
                    } else {
                        query.$or = [
                            { name: new RegExp(category, 'i') },
                            { category: new RegExp(category, 'i') }
                        ];
                    }
                }
                
                if (searchQuery) {
                    const searchRegex = new RegExp(searchQuery, 'i');
                    if (query.$or) {
                        // If we already have an $or from category, we need to be careful
                        // For simplicity, let's just merge or replace
                        query.$or.push({ name: searchRegex }, { description: searchRegex });
                    } else {
                        query.$or = [
                            { name: searchRegex },
                            { description: searchRegex }
                        ];
                    }
                }
                
                const products = await Product.find(query).limit(5);
                suggestedProducts = products; // Save to return to frontend for rich UI
                
                // Send the function result back to the model
                result = await chat.sendMessage([{
                    functionResponse: {
                        name: "get_products",
                        id: call.id,
                        response: { 
                            products: products.map(p => ({
                                _id: p._id,
                                name: p.name,
                                price: p.price,
                                category: p.category,
                                description: p.description,
                                images: p.images,
                                colors: p.colors
                            }))
                        }
                    }
                }]);
                response = result.response;
            }
        }

        const text = response.text();
        res.json({ text, products: suggestedProducts });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ message: "Failed to communicate with WeydiBot.", details: error.message });
    }
};

module.exports = { handleChat };
