const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

// import tutor model
const tutorModel = require('../schemas/Tutor');
const { studentModel } = require('../schemas/Student');
const { authMiddleware } = require('./middleware/AuthMiddleware');

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

// get all tutors
router.get("/", authMiddleware, async (req, res) => {
  try {
    const items = await tutorModel.find();
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
    const topTutors = await tutorModel.find().sort({ rating: -1 }).limit(15).exec();

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

// documentation test
// this is a test by ethan
// filter tutor by subjects logic
router.get("/search", authMiddleware, async (req,res) => {
  try {
    const {subjects} = req.query; // frontend to send a query list of the subjects
  

  if (!subjects) {
    return res.status(400).json({message: "Subjects are required for filtering!"});
  }

  const subjectList = subjects.split(",");
  console.log("Filtering tutors by subjects:", subjectList);

  const filteredTutors = await tutorModel.find({
    subjects: { $in: subjectList}, 
  });

  if (filteredTutors.length == 0) {
    return res.status(404).json({message: "No tutors found for the selected subjects"});
  }
  res.status(200).json(filteredTutors);
} catch (error) {
  console.error("Error filtering tutors:", error);
  res.status(500).json({message: "Server error", error: error.message})
}

});

// get tutor by id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await tutorModel.findById(req.params.id);

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
    const tutor = await tutorModel.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // get all students for tutor
    const students = await studentModel.find({ _id: { $in: tutor.students } });
    console.log("Students for tutor: ", students);

    res.status(200).json({ students: students });
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

    // add student to tutor
    tutor.students.push(student);
    await tutor.save();

    res.status(200).json({ message: 'Student added successfully', tutor: tutor });
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

    // remove student from tutor
    tutor.students = tutor.students.filter((student) => student._id.toString() !== studentId);
    await tutor.save();

    res.status(200).json({ message: 'Student removed successfully', tutor: tutor });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;