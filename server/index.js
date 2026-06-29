const express = require("express");

const app = express();

app.use(express.json())


app.get("/", (req, res) => {
    res.send("Welcome to CodeNova AI Backend!");
});

app.use(express.json())

app.post('/user', (req, res) => {
    console.log(req.body);
    res.send('data received');
})

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});