const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Use axios for HTTP requests
const app = express();
const port = process.env.PORT || 5000;
const mongodb = require("./db/database"); // MongoDB connection file
const User = require("./db/user"); // User model
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
require('dotenv').config();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Add preflight handler
app.options('*', cors());

// Connect to MongoDB
mongodb();

// Root Endpoint
app.get("/", (req, res) => {
    res.json("Server is listening");
});

app.post('/registration', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email exists" });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        await User.create({
            name,
            email,
            password: hash
        });
        
        res.status(200).json({ message: "Registration successful" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide both email and password" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Incorrect email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            res.status(200).json({ message: "Login successful" });
        } else {
            res.status(401).json({ message: "Incorrect email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Function for geocoding using OpenStreetMap Nominatim API
async function geocode(address) {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`, {
        headers: {
            'User-Agent': 'tanmaychavan2214/1.0 (tanmaychavan2214@gmail.com)'
        }
    });
    return response.data;
}

// Endpoint to handle search suggestions based on query
app.get('/search-suggestions', async (req, res) => {
    const query = req.query.query ? req.query.query.toLowerCase() : '';
    
    try {
        // Geocoding the query using Nominatim API
        const data = await geocode(query);

        // Map the results to extract relevant location information (e.g., place name)
        const locations = data.map(location => location.display_name); // Adjust based on what information you want to return

        // Filter results based on user query
        const filteredLocations = locations.filter(location =>
            location.toLowerCase().includes(query)
        );

        res.status(200).json(filteredLocations);
    } catch (err) {
        console.error("Error fetching location:", err);
        res.status(500).json({ message: "Error fetching location", details: err.message });
    }
});

// Hotels fetching endpoint
app.get("/fetch-hotels", async (req, res) => {
    try {
        const query = req.query.query || '';  
        const locationData = await geocode(query);  // Get geocode data based on the query
        if (locationData.length === 0) {
            return res.status(400).json({ message: "No location found" });
        }

        // Get latitude and longitude from geocode data
        const latitude = locationData[0].lat;
        const longitude = locationData[0].lon;

        // Use the latitude and longitude for the API request
        const url = 'https://travel-advisor.p.rapidapi.com/hotels/list-by-latlng';
        const params = {
            latitude: latitude,
            longitude: longitude,
            lunit: 'km',
            currency: 'USD',
            lang: 'en_US',
            search: query
        };

        const headers = {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': process.env.RAPIDAPI_HOST
        };
        
        const response = await axios.get(url, { params, headers });
        res.status(200).json(response.data);
    } catch (err) {
        console.error("Error fetching hotels:", err);
        res.status(500).json({ message: "Error fetching hotels", details: err.message });
    }
});

app.get("/fetch-restaurants", async (req, res) => {
    try {
        const query = req.query.query || '';  
        const locationData = await geocode(query);  // Get geocode data based on the query
        if (locationData.length === 0) {
            return res.status(400).json({ message: "No location found" });
        }

        // Get latitude and longitude from geocode data
        const latitude = locationData[0].lat;
        const longitude = locationData[0].lon;

        // Define the API URL and parameters
        const url = 'https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng';
        const params = {
            latitude: latitude,
            longitude: longitude,
            limit: 30,
            currency: 'USD',
            distance: 2,
            open_now: false,
            lunit: 'km',
            lang: 'en_US'
        };

        const headers = {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': process.env.RAPIDAPI_HOST
        };

        // Make the API request using Axios
        const response = await axios.get(url, { params, headers });

        // Return the data received from the API to the client
        res.status(200).json(response.data);
    } catch (err) {
        console.error("Error fetching restaurants:", err);
        res.status(500).json({ message: "Error fetching restaurants", details: err.message });
    }
});

app.get("/fetch-attractions", async (req, res) => {
    try {
        const query = req.query.query || '';  
        const locationData = await geocode(query);  // Get geocode data based on the query
        if (locationData.length === 0) {
            return res.status(400).json({ message: "No location found" });
        }

        // Get latitude and longitude from geocode data
        const latitude = locationData[0].lat;
        const longitude = locationData[0].lon;

        // Define the API URL and parameters
        const url = 'https://travel-advisor.p.rapidapi.com/attractions/list-by-latlng';
        const params = {
            latitude: latitude,
            longitude: longitude,
            lunit: 'km',
            currency: 'USD',
            lang: 'en_US'
        };

        // Define the headers
        const headers = {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': process.env.RAPIDAPI_HOST
        };

        // Make the API request using Axios
        const response = await axios.get(url, { params, headers });
          
        // Return the data received from the API to the client
        res.status(200).json(response.data);
    } catch (err) {
        console.error("Error fetching attractions:", err);
        res.status(500).json({ message: "Error fetching attractions", details: err.message });
    }
});


// Start the server
module.exports = app;
