import React, { useState } from "react";
import styles from './Authentication.module.css'
import { X } from 'lucide-react'
import { authenticateTutor } from "../../proxies/tutors";
import { authenticateStudent } from "../../proxies/students";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { registerStudent } from "../../proxies/students.js";
import { registerTutor } from "../../proxies/tutors.js";  // Create this function in your proxy folder


// @Authentication
const Authentication = () => {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [isTutor, setIsTutor] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [currentSubject, setCurrentSubject] = useState("");
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    role: "Student"
  });

  const handleToggle = () => setIsRegistering(!isRegistering);
  const handleRoleToggle = () => setIsTutor(!isTutor);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
  };

  const handleSubjectChange = (e) => {
    setCurrentSubject(e.target.value);
  };

  const addSubject = () => {
    if (currentSubject && !subjects.includes(currentSubject)) {
      setSubjects([...subjects, currentSubject]);
      setCurrentSubject("");
    }
  };

  const removeSubject = (subjectToRemove) => {
    setSubjects(subjects.filter(subject => subject !== subjectToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically handle form submission
    console.log('Form submitted:', formValues);

    if(isRegistering){

      if(!isTutor){
    
      const { firstName, lastName, username, email, password } = formValues;
      try {
      const response = await registerStudent({ firstName, lastName, username, email, password });
      alert("Student registered successfully!");
      console.log(response);  // Log the response for debugging
    } catch (error) {
      console.error(error);
      alert("Registration failed. Please try again.");
    }


  }

  if (isTutor) {
  const { firstName, lastName, username, email, password, bio } = formValues;
  try {
    console.log('Registration Data:', { 
      firstName, 
      lastName, 
      username, 
      email, 
      password, 
      bio,
      subjects 
    });

    const response = await registerTutor({ 
      firstName, 
      lastName, 
      username, 
      email, 
      password, 
      bio,
      subjects  
    });
    alert("Tutor registered successfully!");
    console.log(response);  // Log the full response
  } catch (error) {
    console.error('Full Error Object:', error);
    
    // More detailed error logging
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Error Response Data:', error.response.data);
      console.error('Error Response Status:', error.response.status);
      console.error('Error Response Headers:', error.response.headers);
      
      // Show more specific error message from backend
      alert(error.response.data.message || "Tutor Registration failed.");
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error Request:', error.request);
      alert("No response received from server. Please check your network connection.");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error Message:', error.message);
      alert("An error occurred during registration. " + error.message);
    }
  }
}


}
    if (!isRegistering) {
      const username = formValues.username;
      const password = formValues.password;

      if (isTutor) {
        // login as tutor
        console.log('Tutor login');
        try {
          const response = await authenticateTutor(username, password);

          login(response.data.user, response.data.token);
          console.log("logged in user: ", response.data.user);

          // navigate to previous location if available, otherwise go to home
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });    // replace -> dont store /authentication in location history
        }
        catch (error) {
          console.error(error);
          // display error message if status code is 401
          if (error.response?.status === 401) {
            alert(`${error.response.data.message}`);  // using alert for now
          }
        }
      }
      else {
        // login as student
        console.log('Tutor login');
        try {
          const response = await authenticateStudent(username, password);

          login(response.data.user, response.data.token);
          console.log("logged in user: ", response.data.user);

          // navigate to previous location if available, otherwise go to home
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });    // replace -> dont store /authentication in location history
        }
        catch (error) {
          console.error(error);
          // display error message if status code is 401
          if (error.response?.status === 401) {
            alert(`${error.response.data.message}`);  // using alert for now
          }
        }
      }
    }
  }


  return (
    <main className={styles.authContainer}>
      <div className={styles.authContent}>
        {/* @ImageSection */}
        <section className={styles.imageColumn}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/bd390813376515dd7ae08ad55877995dbb4a274c4c50dacbf57e49e90a3e236c?placeholderIfAbsent=true&apiKey=64660e2c63d94981b8633c628b78e296"
            alt="UMTutorConnect visual representation"
            className={styles.mainImage}
          />
        </section>
        {/* @FormSection */}
        <section className={styles.formColumn}>
          <div className={styles.formWrapper}>
            <h1 className={styles.authTitle}>UMTutorConnect</h1>
            {/* @TabContainer */}
            <div className={styles.tabContainer}>
              <button
                type="button"
                className={`${styles.tabButton} ${!isRegistering ? styles.activeTab : ''}`}
                onClick={handleToggle}
              >
                Login
              </button>
              <button
                type="button"
                className={`${styles.tabButton} ${isRegistering ? styles.activeTab : ''}`}
                onClick={handleToggle}
              >
                Register
              </button>
            </div>
            {/* @AuthForm */}
            <form className={styles.authForm} onSubmit={handleSubmit}>
              {isRegistering && (
                <>
                  {/* @NameFields */}
                  <div className={styles.nameFields}>
                    <input
                      type="text"
                      id="firstName"
                      value={formValues.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      className={styles.inputField}
                      required
                    />
                    <input
                      type="text"
                      id="lastName"
                      value={formValues.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className={styles.inputField}
                      required
                    />
                  </div>
                </>
              )}
              <input
                type="text"
                id="username"
                value={formValues.username}
                onChange={handleChange}
                placeholder="Username"
                className={styles.inputField}
                required
              />
              {isRegistering && (
                <input
                  type="email"
                  id="email"
                  value={formValues.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className={styles.inputField}
                  required
                />
              )}
              <input
                type="password"
                id="password"
                value={formValues.password}
                onChange={handleChange}
                placeholder="Password"
                className={styles.inputField}
                required
              />
              {isRegistering && (
                <input
                  type="password"
                  id="confirmPassword"
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={styles.inputField}
                  required
                />
              )}
              {isRegistering && isTutor && (
                <>
                  <textarea
                    id="bio"
                    value={formValues.bio}
                    onChange={handleChange}
                    placeholder="Your bio"
                    className={styles.bioField}
                    required
                  />
                  {/* @SubjectsSection */}
                  <div className={styles.subjectsContainer}>
                    <label htmlFor="subjects" className={styles.subjectsLabel}>Subjects</label>
                    <div className={styles.subjectsInputContainer}>
                      <input
                        type="text"
                        id="subjects"
                        value={currentSubject}
                        onChange={handleSubjectChange}
                        placeholder="Add a subject"
                        className={styles.subjectsInput}
                      />
                      <button type="button" onClick={addSubject} className={styles.addButton}>Add</button>
                    </div>
                    {/* @SubjectTags */}
                    <div className={styles.subjectTags}>
                      {subjects.map((subject, index) => (
                        <span key={index} className={styles.subjectTag}>
                          {subject}
                          <button
                            type="button"
                            onClick={() => removeSubject(subject)}
                            className={styles.removeSubjectButton}
                            aria-label={`Remove ${subject}`}
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {/* @RoleToggle */}
              <div className={styles.roleToggle}>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={isTutor}
                    onChange={handleRoleToggle}
                  />
                  <span className={styles.slider}></span>
                </label>
                {isRegistering && <span className={styles.roleLabel}>I want to be a tutor</span>}
                {!isRegistering && <span className={styles.roleLabel}>I am a tutor</span>}
              </div>
              <button type="submit" className={styles.submitButton}>
                {isRegistering ? "Register" : "Login"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Authentication;

