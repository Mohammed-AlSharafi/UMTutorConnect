import axiosInstance from "./axiosHandler";

const authenticateStudent = async (username, password) => {
  try {
    const response = await axiosInstance.post("/studentApi/authenticate", {
      enteredUsername: username,
      enteredPassword: password,
    });
    console.log("response: ", response);
    return response;
  }
  catch (error) {
    if (error.response) {
      // error already handled by interceptor
      // no specific error handling for now
    }
    else {
      console.error(error);
    }
    throw error;
  }
}

export { authenticateStudent };



const registerStudent = async (studentData) => {
  try {
    const response = await axiosInstance.post("/studentApi/register", studentData);
    console.log("Student registered: ", response);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response);
    } else {
      console.error(error);
    }
    throw error;
  }
};

export { registerStudent };
