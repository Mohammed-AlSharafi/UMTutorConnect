import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001",            // base url of backend server
  // timeout: 5000,                            // default timeout of 3 seconds
  headers: { "Content-Type": "application/json" },   // default content type, can be overridden such as in fileHandler.js
});


// Add a response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Server responded with a status other than 2xx (HTTP status errors)
      console.error("Global error response:", error.response.data);
      console.error("Global error status:", error.response.status);
      console.error("Global error headers:", error.response.headers);
    }
    else if (error.request) {
      // Request was made but no response was received
      console.error("Global error request:", error.request);
    }
    else {
      // Something happened in setting up the request
      console.error("Global error message:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;