const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        default: function () {
            return this.firstName + " " + this.lastName;
        },
    },
    // profilePicture: {
    //     type: String,
    // },
    bio: {
        type: String,
        required: true,
    },
    subjects: {
        type: [String], // Array of strings
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    
    role: {
        type: String,
        default: "Tutor",
        required: true,
    },
    // enabled: {
    //     type: Boolean,
    //     default: true,
    // },
    // dateCreated: {
    //     type: Date,
    //     default: Date.now,
    // },
    // dateUpdated: {
    //     type: Date,
    //     default: Date.now,
    // },
})

const model = mongoose.model("Tutor", tutorSchema);
module.exports = model;
