import axiosInstance from "./axiosHandler";

const editStudentProfile = async (studentId, updatedData) => {
  try {
    const response = await axiosInstance.put(`/studentApi/editProfile/${studentId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    });
    console.log("Student profile updated: ", response);
    return response.data.student;
  } catch (error) {
    if (error.response) {
      console.error("Error updating Student profile:", error.response.data);
    } else {
      console.error(error);
    }
    throw error;
  }
};


const getStudentById = async (studentId) => {
  try {
    const response = await axiosInstance.get(`/studentApi/${studentId}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    });
    console.log("Student data: ", response);
    return response;
  }
  catch (error) {
    if (error.response) {
      console.error("Error response:", error.response);
    }
    else {
      console.error(error);
    }
    throw error;
  }
};

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

export { getStudentById, authenticateStudent, registerStudent, editStudentProfile };
