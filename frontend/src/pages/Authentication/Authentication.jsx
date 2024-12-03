import React, { useState } from "react";
import styles from './Authentication.module.css'
import { X } from 'lucide-react'

// @Authentication
const Authentication = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle form submission
    console.log('Form submitted:', formValues);
  };

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
                    <span className={styles.roleLabel}>I want to be a tutor</span>
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

