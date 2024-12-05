const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

// import tutor model
const tutorModel = require('../schemas/Tutor');


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

// get tutor by id
router.get("/:id", async (req, res) => {
  try {
    const item = await tutorModel.findById(req.params.id);
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

module.exports = router;