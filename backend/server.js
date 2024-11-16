const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mongodb = require("./db/database"); // MongoDB connection file
const User = require("./db/user"); // User model

app.use(express.json());

// Connect to MongoDB
mongodb();

// Root Endpoint
app.get("/", (req, res) => {
    res.json("Server is listening");
});

// Registration Endpoint
app.post('/registration', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("Request Body:", req.body);

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(202).json({ message: "Registration successful" });
    } catch (e) {
        console.error("Error during registration:", e.message);
        res.status(500).json({ error: "Registration unsuccessful", details: e.message });
    }
});

app.post("/login", async(req, res)=>{
    console.log(req.body);
    const {username ,password} = req.body;
    const user = await User.findOne({username});
    if(!user){
        return res.status(401).json({message : "user incorrect username and password"})
    }
    if(user.password != password){
        return res.status(401).json({message : "incorrect username and password"})
    }
    res.status(501).json({message : "successfullly login"})
})


// Start Server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
