const express = require('express');
const router = express.Router();

// import student model
const studentModel = require('../schemas/Student');

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

module.exports = router;