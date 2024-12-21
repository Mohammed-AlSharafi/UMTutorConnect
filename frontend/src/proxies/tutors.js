import axiosInstance from "./axiosHandler";

export const getTutorById = async (tutorId) => {
  try {
    const response = await axiosInstance.get(`/tutorApi/${tutorId}`);
    console.log("Tutor data: ", response);
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

export const registerTutor = async (tutorData) => {
  try {
    const response = await axiosInstance.post("/tutorApi/register", tutorData);
    console.log("Tutor registered: ", response);
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

export const authenticateTutor = async (username, password) => {
  try {
    const response = await axiosInstance.post("/tutorApi/authenticate", {
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

export const fetchTopTutors = async () => {
  try {
    const response = await axiosInstance.get("tutorApi/topTutors");
    console.log("Top tutors fetched: ", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching top tutors:", error.response.data);
    } else {
      console.error(error);
    }
    throw error;
  }
}

export const fetchTutorsBySubject = async (subject) => {
  try {
    console.log("Fetching tutors for subject: ", subject);
    const response = await axiosInstance.get(`tutorApi/search?subject=${encodeURIComponent(subject)}`);
    console.log("Tutors fetched: ", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching tutors:", error.response.data);
    } else {
      console.error(error);
    }
    throw error;
  }
}

export const getStudents = async (tutorId) => {
  try {
    const response = await axiosInstance.get(`tutorApi/${tutorId}/students`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    });
    console.log("Students fetched: ", response.data.students);
    return response.data.students;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching students:", error.response.data);
    } else {
      console.error(error);
    }
    throw error;
  }
};

export const addStudent = async (studentId, tutorId) => {
  try {
    const response = await axiosInstance.post(`tutorApi/addStudent/${tutorId}`, { studentId });
    console.log("Student added: ", response);
    return response.data.tutor;
  } catch (error) {
    if (error.response) {
      console.error("Error adding student:", error.response.data);
    } else {
      console.error(error);
    }
    throw error;
  }
}

export const removeStudent = async (studentId, tutorId) => {
  try {
    const response = await axiosInstance.post(`tutorApi/removeStudent/${tutorId}`, { studentId });
    console.log("Student removed: ", response);
    return response.data.tutor;
  } catch (error) {
    if (error.response) {
      console.error("Error removing student:", error.response.data);
    } else {
      console.error(error);
    }
    throw error;
  }
}
// export { getTutorById, authenticateTutor, registerTutor, fetchTopTutors, fetchTutorsBySubject };