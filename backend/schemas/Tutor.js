const mongoose = require("mongoose");
const { studentSchema } = require("./Student");

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
        default: 10
    },
    rating: {
        type: Number,
        default: 0,
        required: true,
        validate: {
            validator: function (v) {
                return v >= 0 && v <= 5;
            },
            message: "Rating must be between 0 and 5",
        },
    },
    role: {
        type: String,
        default: "Tutor",
        required: true,
    },
    students: {
        type: [studentSchema],
        default: [],
    }
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

const tutorModel = mongoose.model("Tutor", tutorSchema);
module.exports = tutorModel;
