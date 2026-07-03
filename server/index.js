require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const cors = require("cors"); 

const express = require("express");

const app = express();

app.use(express.json())

app.use(cors())

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});


app.get("/", (req, res) => {
    res.send("Welcome to CodeNova AI Backend!");
});

app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;

        const response = await ai.interactions.create({
            model: "gemini-2.5-flash",
            input: prompt
        });

        return res.json({
            response: response.output_text
        });

        console.log(response.output_text)
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Something went wrong.",
        })
    }

})

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

console.log('Server is listening...')