const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
const mongodb = require("./db/database"); // MongoDB connection file
const User = require("./db/user"); // User model
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',  // Allow only your frontend to access
    credentials: true,  // Allow cookies and credentials to be sent
  }));
// Connect to MongoDB
mongodb();



// Root Endpoint
app.get("/", (req, res) => {
    res.json("Server is listening");
});







app.post('/registration', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("Request Body:", req.body);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists!" });
        }
        bcrypt.genSalt(10, (err,salt)=>{
            bcrypt.hash(password, salt, async (err,hash)=>{
               
    let user =      await  User.create({
         name : name,
         email : email,
         password : hash,

    })
    await user.save();
    let token = jwt.sign({email:email},"encryption")
    res.cookie("token",token)
    
     res.status(200).json({ message: "Registration successful" });
            })
    })}
        // const newUser = new User({ name, email, password });
        // await newUser.save();

       
     catch (e) {
        console.error("Error during registration:", e.message);
        res.status(500).json({ error: "Registration unsuccessful", details: e.message });
    }
});

app.post("/login", async(req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide both name and password" });
    }

    const user = await User.findOne({ email});
    if (!user) {
        return res.status(401).json({ message: "Incorrect username or password" });
    }
   else{
    bcrypt.compare(password, user.password, (err,result)=>{
        if(result){
            
            let token = jwt.sign({email:email},"encryption")
            res.cookie("token",token)
            res.status(200).json({message : "login successful"})
        }
        else{
            res.status(500).json({message :"something went wrong"})
        }
    })
   }
    
});
app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
});

function isLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const data = jwt.verify(token, "encryption");
        req.user = data;  // Store the decoded token in request for further use
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}



// Start Server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
