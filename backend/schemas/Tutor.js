const mongoose = require("mongoose");
const { studentSchema } = require("./Student");


const ratingSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student", // Reference to the Student model
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5, // Restrict rating values between 0 and 5
    },
});

const tutorSchema = new mongoose.Schema({
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
    profilePicture: {
        type: String,
        default: "https://res.cloudinary.com/ds7sfbksv/image/upload/v1734976936/98a0fe74-c9f7-4414-ae3f-d5e02372b45c.png",
    },
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
        default: 10.0
    },
    ratings: {
        type: [ratingSchema],
        default: [],
    },
    averageRating: {
        type: Number,
        default: 0.0,
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
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student", // Reference to the Student model
        }],
        default: [],
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

// method to be used to update ratings
tutorSchema.methods.updateRating = async function (studentId, newRating) {
    // "this" refers to the current tutor document
    const existingRating = this.ratings.find(
        (rating) => rating.studentId.toString() === studentId
    );

    if (existingRating) {
        // Update the existing rating
        existingRating.rating = newRating;
    } else {
        // Add a new rating
        this.ratings.push({ studentId, rating: newRating });
    }

    // Recalculate the average rating
    const totalRatings = this.ratings.reduce((sum, r) => sum + r.rating, 0);
    this.averageRating = totalRatings / this.ratings.length;

    await this.save();
    return this;
};

const tutorModel = mongoose.model("Tutor", tutorSchema);
module.exports = tutorModel;
