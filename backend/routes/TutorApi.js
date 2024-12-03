const express = require('express');
const router = express.Router();

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


module.exports = router;