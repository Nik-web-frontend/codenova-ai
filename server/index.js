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

        const stream = await ai.interactions.create({
            model: "gemini-2.5-flash",
            input: prompt,
            stream: true,
        });

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Transfer-Encoding", "chunked");

        for await (const event of stream) {
            if (
                event.event_type === "step.delta" &&
                event.delta?.type === "text"
            ) {
                res.write(event.delta.text);
            }
        }

        res.end();

    }
    catch (error) {
        console.error(error);

        if (!res.headersSent) {
            return res.status(500).json({
                error: "Something went wrong.",
            });
        }

        res.end();
    }

})

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

console.log('Server is listening...')