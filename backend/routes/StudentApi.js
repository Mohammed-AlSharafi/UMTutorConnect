const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");


// import student model
const studentModel = require('../schemas/Student');

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
router.get("/", async (req, res) => {
  try {
    const items = await studentModel.find();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// get student by id
router.get("/:id", async (req, res) => {
  try {
    const item = await studentModel.findById(req.params.id);
    res.status(200).json(item);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// get student by username
router.get("/:username", async (req, res) => {
  try {
    const item = await studentModel.findById(req.params.username);
    res.status(200).json(item);
  }
  catch (error) {
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
    // const isValidPassword = await bcrypt.compare(password, student.password);
    const isValidPassword = enteredPassword === student.password;
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // remove the password field from the student object
    const { password, _v, ...studentDataExcludingPassword } = student._doc;
    console.log("studentData: ", studentDataExcludingPassword);

    // generate token (no expiry -- not recommneded)
    const token = jwt.sign(studentDataExcludingPassword, process.env.JWT_SECRET, {});

    res.status(200).json({ user: studentDataExcludingPassword, token: token });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// Update student profile
router.put("/update/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const { firstName, lastName, email, bio, subjects, rate, password } = req.body;

    // Find the student by username
    const existingStudent = await studentModel.findOne({ username });
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    // if (!req.body) {
    //   return res.status(404).json({ message: "No req.body data passed improper" });
    // }


    //Student Schema
    // {
    // const studentSchema = new mongoose.Schema({
    //     username: {
    //         type: String,
    //         required: true,
    //         unique: true,
    //     },
    //     password: {
    //         type: String,
    //         required: true,
    //     },
    //     email: {
    //         type: String,
    //         required: true,
    //         unique: true,
    //     },
    //     firstName: {
    //         type: String,
    //         required: true,
    //     },
    //     lastName: {
    //         type: String,
    //         required: true,
    //     },
    //     fullName: {
    //         type: String,
    //         default: function () {
    //             return this.firstName + " " + this.lastName;
    //         },
    //     },
    //     profilePicture: {
    //         type: String,
    //     },
    //     role: {
    //         type: String,
    //         default: "Student",
    //         required: true,
    //     },
    //     // enabled: {
    //     //     type: Boolean,
    //     //     default: true,
    //     // },
    //     // dateCreated: {
    //     //     type: Date,
    //     //     default: Date.now,
    //     // },
    //     dateUpdated: {
    //         type: Date,
    //         default: Date.now,
    //     },
    // });
    // }

    if (username) existingStudent.username = username;
    //if (password) existingStudent.password = password;
    if (email) existingStudent.email = email;
    if (firstName) existingStudent.firstName = firstName;
    if (lastName) existingStudent.lastName = lastName;
    if (firstName && lastName) existingStudent.fullName = firstName + " " + lastName;
    console.log("existingStudent.fullName: ", existingStudent.fullName);
    existingStudent.dateUpdated = new Date();


    console.log("Sending Existing Student: ", existingStudent);

    const updatedStudent = await existingStudent.save()
  .then((doc) => {
    console.log("Successfully saved to MongoDB:", doc);
    return doc;
  })
  .catch((err) => {
    console.error("Error saving to MongoDB:", err);
    throw err; // To handle it in the catch block
  });

    res.status(200).json({ message: "Profile updated successfully", student: updatedStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


module.exports = router;


