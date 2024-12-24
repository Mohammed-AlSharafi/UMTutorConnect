const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

// import tutor model
const tutorModel = require('../schemas/Tutor');
const { studentModel } = require('../schemas/Student');
const { authMiddleware } = require('./middleware/AuthMiddleware');


// Update tutor profile (PUT)
router.put("/editProfile/:id", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, fullName, email, bio, subjects, rate } = req.body;
    const tutorId = req.params.id;

    // Check if logged in user is updating their own profile
    if (!req.user || req.user._id.toString() !== tutorId) {
      return res.status(403).json({ message: 'Unauthorized to update profile' });
    }

    // Check if tutor exists
    const updatedTutor = await tutorModel.findByIdAndUpdate(tutorId, req.body, { new: true })
      .populate('students');

    if (!updatedTutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // Save updated tutor
    await updatedTutor.save();

    // Send response
    res.status(200).json({ message: 'Tutor profile updated successfully', tutor: updatedTutor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Update tutor rating (PUT)
router.put("/updateRating/:tutorId", authMiddleware, async (req, res) => {
  try {
    const { studentId, newRating } = req.body;
    const tutorId = req.params.tutorId;

    console.log("studentId: ", studentId);
    console.log("newRating: ", newRating);

    // validate the studentId matches the logged in user
    if (!req.user || req.user.id !== studentId) {
      return res.status(403).json({ message: 'Unauthorized to update rating' });
    }

    const tutor = await tutorModel.findById(tutorId).populate('students');
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    await tutor.updateRating(studentId, newRating);

    res.status(200).json({ message: 'Rating updated successfully', tutor: tutor });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Register Tutor (POST)
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, bio, profilePicture, subjects, rate } = req.body;

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
      rate,
      profilePicture,
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

// login tutor
router.post("/authenticate", async (req, res) => {
  try {
    const { enteredUsername, enteredPassword } = req.body;
    console.log("enteredUsername: ", enteredUsername);
    console.log("enteredPassword: ", enteredPassword);

    // find user
    const tutor = await tutorModel.findOne({ username: enteredUsername })
      .select("+password")
      .populate("students");

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

// get all tutors
router.get("/", authMiddleware, async (req, res) => {
  try {
    const items = await tutorModel.find().populate("students");
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// get top tutors
router.get("/topTutors", authMiddleware, async (req, res) => {
  try {
    // get the tutors with the highest ratings
    const topTutors = await tutorModel.find()
      .sort({ averageRating: -1 })
      .limit(15)
      .populate("students")
      .exec();

    res.status(200).json(topTutors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// search tutors by subject
router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { subject } = req.query;

    // subject is blank
    if (!subject) {
      return res.status(400).json({ error: 'Subject is required' });
    }

    // Use regex for case-insensitive and substring matching
    const tutors = await tutorModel.find({ subjects: { $regex: subject, $options: 'i' } })
      .populate("students");

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
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await tutorModel.findById(req.params.id).populate("students");

    const { password, _v, ...userWithoutPassword } = item._doc;
    console.log("userWithoutPassword: ", userWithoutPassword);

    res.status(200).json({ user: userWithoutPassword });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// get all students for tutor
router.get("/:id/students", authMiddleware, async (req, res) => {
  try {
    const tutorId = req.params.id;

    if (!req.user || req.user.id !== tutorId) {
      return res.status(403).json({ message: 'Unauthorized to access these students' });
    }

    // find tutor
    const tutor = await tutorModel.findById(tutorId).populate("students");
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    console.log("Students for tutor: ", tutor.students);

    res.status(200).json({ students: tutor.students });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
})

// add student for tutor
router.post("/addStudent/:tutorId", authMiddleware, async (req, res) => {
  try {
    const { studentId } = req.body;
    const tutorId = req.params.tutorId;

    // find tutor
    const tutor = await tutorModel.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // find student
    const student = await studentModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if the student is already added
    if (tutor.students.includes(studentId)) {
      return res.status(400).json({ message: "Student already added to this tutor" });
    }

    // Add student ID to the tutor's students array
    tutor.students.push(studentId);
    await tutor.save();

    const updatedTutor = await tutorModel
      .findById(tutorId)
      .populate("students");

    res.status(200).json({ message: 'Student added successfully', tutor: updatedTutor });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// remove student for tutor
router.post("/removeStudent/:tutorId", authMiddleware, async (req, res) => {
  try {
    const { studentId } = req.body;
    const tutorId = req.params.tutorId;

    // find tutor
    const tutor = await tutorModel.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // find student
    const student = await studentModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if the student is in the tutor's list
    if (!tutor.students.includes(studentId)) {
      return res.status(400).json({ message: "Student not associated with this tutor" });
    }

    // Remove the student ID from the tutor's students array
    tutor.students = tutor.students.filter(
      (id) => id.toString() !== studentId
    );

    await tutor.save();

    const updatedTutor = await tutorModel
      .findById(tutorId)
      .populate("students");

    res.status(200).json({ message: 'Student removed successfully', tutor: updatedTutor });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;