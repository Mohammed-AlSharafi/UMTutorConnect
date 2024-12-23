const express = require('express');
const cloudinary = require("cloudinary").v2;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const PORT = 3001;

// Load environment variables from .env file
dotenv.config();

// configure cors
let cors = require('cors');
app.use(cors());

// Middleware to parse json in requests
app.use(express.json());

// Database Initializeation
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Failed to connect to MongoDB ', err);
  });


// configure cloudinary for uploading files to cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// create endpoint to generate a signature for uploading files to Cloudinary
// https://cloudinary.com/documentation/authentication_signatures#using_cloudinary_backend_sdks_to_generate_sha_authentication_signatures
app.post("/upload/signature", async (req, res) => {
  try {
    console.log(req.body);

    const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign = req.body;
    paramsToSign.timestamp = timestamp;

    const api_secret = process.env.CLOUDINARY_API_SECRET;

    // Create a signature
    const signature = cloudinary.utils.api_sign_request(paramsToSign, api_secret);
    const api_key = process.env.CLOUDINARY_API_KEY;
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;

    res.status(200).json({ timestamp, signature, api_key, cloud_name });
  }
  catch (error) {
    res.status(500).json({ message: "Failed to upload file.", error: error.message });
  }
});


// routes
const studentApi = require('./routes/StudentApi');
app.use('/studentApi', studentApi);

const tutorApi = require('./routes/TutorApi');
app.use('/tutorApi', tutorApi);

const chatApi = require('./routes/ChatApi');
app.use('/chatApi', chatApi);


// initialize server
app.listen(PORT, (req, res) => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
