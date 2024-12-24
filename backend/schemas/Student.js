const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false, // Hide the password from query results by default
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
    background: {
        type: String,
        required: true,
    },
    // profilePicture: {
    //     type: String,
    // },
    role: {
        type: String,
        default: "Student",
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
});

const studentModel = mongoose.model("Student", studentSchema);
module.exports = { studentModel, studentSchema };
