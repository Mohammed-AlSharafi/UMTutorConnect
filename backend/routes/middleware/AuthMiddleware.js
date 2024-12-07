const jwt = require('jsonwebtoken');
const studentModel = require("../../schemas/Student");
const tutorModel = require("../../schemas/Tutor");

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const modelToUse = (decoded.role == "Student") ? studentModel : tutorModel;
    const user = await modelToUse.findById(decoded._id).select("-password");   // dont include password in response
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // attach user data to request
    req.user = user;

    // proceed to next method
    next();
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { authMiddleware };