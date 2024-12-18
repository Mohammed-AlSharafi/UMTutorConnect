const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

// import tutor model
const tutorModel = require('../schemas/Tutor');

// Register Tutor (POST)
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, bio, subjects, rate } = req.body;

    // Check if the tutor already exists
    const existingTutor = await tutorModel.findOne({ username });
    if (existingTutor) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash the password before saving
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Create new tutor
    const newTutor = new tutorModel({
      firstName,
      lastName,
      username,
      email,
      password,
      bio,
      subjects,
      rate
    });

     // Save the tutor to the database
    await newTutor.save();

    

    // Send success response
    res.status(201).json({ message: "Tutor registered successfully", tutor: newTutor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Dummy data for top tutors
const topTutors = [
  { fullName: "John Doe", subjects: "Data Structures", rate: 20, img: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { fullName: "Cat Smith", subjects: "Algorithms", rate: 25, img: "https://plus.unsplash.com/premium_photo-1658506795539-8c3e055c960c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
  { fullName: "Chris Lee", subjects: "Machine Learning", rate: 30, img: "https://images.unsplash.com/photo-1495603889488-42d1d66e5523?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}

// 	You can add more here
];

// set routes

// get all tutors
router.get("/", async (req, res) => {
  try {
    const items = await tutorModel.find();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// get top tutors
router.get("/topTutors", (req, res) => {
  try {
    res.status(200).json(topTutors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message});
  }
});

// search tutors by subject
router.get("/search", async (req, res) => {
  try {
    const { subject } = req.query;

    // subject is blank
    if (!subject) {
      return res.status(400).json({ error: 'Subject is required' });
    }

    // Use regex for case-insensitive and substring matching
    const tutors = await tutorModel.find({ subjects: { $regex: subject, $options: 'i' } });

    // no tutor for subject
    if (tutors.length === 0) {
      console.log("No tutors found for subject: ", subject);
      return res.status(404).json({ message: 'No tutors found for this subject' });
    }
    console.log("Tutors found for subject: ", subject, tutors);
    res.status(200).json(tutors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// get tutor by id
router.get("/:id", async (req, res) => {
  try {
    const item = await tutorModel.findById(req.params.id);
    console.log("id checking: ", req.params.id);
    res.status(200).json(item);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// get tutor by id
router.get("/:username", async (req, res) => {
  try {
    const item = await tutorModel.findById(req.params.username);
    res.status(200).json(item);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// login tutor
router.post("/authenticate", async (req, res) => {
  try {
    const { enteredUsername, enteredPassword } = req.body;
    console.log("enteredUsername: ", enteredUsername);
    console.log("enteredPassword: ", enteredPassword);

    // find user
    const tutor = await tutorModel.findOne({
      username: enteredUsername,
    });
    if (!tutor) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // validate password
    // const isValidPassword = await bcrypt.compare(password, tutor.password);
    const isValidPassword = enteredPassword === tutor.password;
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // remove the password field from the tutor object
    const { password, _v, ...tutorDataExcludingPassword } = tutor._doc;
    console.log("tutorData: ", tutorDataExcludingPassword);

    // generate token (no expiry -- not recommneded)
    const token = jwt.sign(tutorDataExcludingPassword, process.env.JWT_SECRET, {});

    res.status(200).json({ user: tutorDataExcludingPassword, token: token });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Update tutor profile
router.put("/update/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const { firstName, lastName, email, bio, subjects, rate, password } = req.body;

    // Find the tutor by username
    const existingTutor = await tutorModel.findOne({ username });
    if (!existingTutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }
    
    if (!req.body) {
      return res.status(404).json({ message: "No req.body data passed improper" });
    }

    // Check if the username is already taken by another tutor
    // const usernameExists = await tutorModel.findOne({ username, _id: { $ne: existingTutor._id } });
    // if (usernameExists) {
    //   return res.status(400).json({ message: "Username already taken" });
    // }

    //Tutor Schema
    // {
    //   _id: new ObjectId('676173b8a84f1c7b2896c86f'),
    //   username: 'shahid.ben@gmail.com',
    //   password: '123',
    //   email: 'shahid.ben@gmail.com',
    //   firstName: 'Mohammad Shahid1',
    //   lastName: 'Akhtar',
    //   bio: 'Hi',
    //   subjects: [ 'Computer Science' ],
    //   rate: 10,
    //   role: 'Tutor',
    //   fullName: 'Mohammad Shahid Akhtar',
    //   __v: 0,
    //   dateUpdated: 2024-12-17T23:04:18.273Z
    // }

    if (username) existingTutor.username = username;
    //if (password) existingTutor.password = password;
    if (email) existingTutor.email = email;
    if (firstName) existingTutor.firstName = firstName;
    if (lastName) existingTutor.lastName = lastName;
    if (bio) existingTutor.bio = bio;
    if (subjects) existingTutor.subjects = subjects;
    if (rate) existingTutor.rate = rate;
    // if (role) existingTutor.role = subjects;
    if (firstName && lastName) existingTutor.fullName = firstName + " " + lastName;
    existingTutor.dateUpdated = new Date();


    console.log("Sending Existing tutor: ", existingTutor);

    const updatedTutor = await existingTutor.save()
  .then((doc) => {
    console.log("Successfully saved to MongoDB:", doc);
    return doc;
  })
  .catch((err) => {
    console.error("Error saving to MongoDB:", err);
    throw err; // To handle it in the catch block
  });

    res.status(200).json({ message: "Profile updated successfully", tutor: updatedTutor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


module.exports = router;