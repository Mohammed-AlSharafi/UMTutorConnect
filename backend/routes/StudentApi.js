const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");


// import student model
const { studentModel } = require('../schemas/Student');  // student schema exports both model and schema
const { authMiddleware } = require('./middleware/AuthMiddleware');


// Update Student profile (PUT)
router.put("/editProfile/:id", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    const studentId = req.params.id;

    // Check if studemt exists
    const student  = await studentModel.findById(studentId).select("-password");
    if (!student ) {
      return res.status(404).json({ message: 'Student  not found' });
    }

    // Update Student details
    student.firstName = firstName || student.firstName;
    student.lastName = lastName || student.lastName;
    student.fullName = firstName.trim() && lastName.trim() ? `${firstName} ${lastName}` : `${student.firstName} ${student.lastName}`;
    student.username = username || student.username;
    student.email = email || student.email;

    // Save updated Student
    await student.save();

    // Send response
    res.status(200).json({ message: 'Student profile updated successfully', student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Register student (POST)
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    // Check if the student already exists
    const existingStudent = await studentModel.findOne({ username });
    if (existingStudent) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash the password before saving
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Create new student
    const newStudent = new studentModel({
      firstName,
      lastName,
      username,
      email,
      password
    });

    // Save the student to the database
    await newStudent.save();

    // Send success response
    res.status(201).json({ message: "Student registered successfully", student: newStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


// set routes

// get all students
router.get("/", authMiddleware, async (req, res) => {
  try {
    const items = await studentModel.find();
    res.status(200).json({students: items});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// login student
router.post("/authenticate", async (req, res) => {
  try {
    const { enteredUsername, enteredPassword } = req.body;
    console.log("enteredUsername: ", enteredUsername);
    console.log("enteredPassword: ", enteredPassword);

    // find user
    const student = await studentModel.findOne({
      username: enteredUsername,
    });
    if (!student) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // validate password
    // const isValidPassword = await bcrypt.compare(password, tutor.password);
    const isValidPassword = enteredPassword === student.password;
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // remove the password field from the tutor object
    const { password, _v, ...tutorDataExcludingPassword } = student._doc;
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


// get student by id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await studentModel.findById(req.params.id);

    const { password, _v, ...userWithoutPassword } = item._doc;
    res.status(200).json({ user: userWithoutPassword });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;


