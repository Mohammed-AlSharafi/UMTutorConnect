import axiosInstance from "./axiosHandler";

const registerTutor = async (tutorData) => {
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

export { registerTutor };

const authenticateTutor = async (username, password) => {
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
const fetchTopTutors = async () => {
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
const fetchTutorsBySubject = async(subject) => {
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

export { authenticateTutor, fetchTopTutors, fetchTutorsBySubject };