const express = require('express');
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
