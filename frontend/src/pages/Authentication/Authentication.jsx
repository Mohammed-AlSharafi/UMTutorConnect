import React, { useState } from "react";
import styles from "./Authentication.module.css";

const Authentication = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleToggle = () => setIsRegistering(!isRegistering);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
  };

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <section className={styles.imageColumn}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/bd390813376515dd7ae08ad55877995dbb4a274c4c50dacbf57e49e90a3e236c?placeholderIfAbsent=true&apiKey=64660e2c63d94981b8633c628b78e296"
            alt="UMTutorConnect visual representation"
            className={styles.mainImage}
          />
        </section>
        <section className={styles.formColumn}>
          <div className={styles.formWrapper}>
            <h1 className={styles.title}>UMTutorConnect</h1>
            <div className={styles.tabContainer}>
              <button
                className={`${styles.tabButton} ${
                  !isRegistering ? styles.activeTab : ""
                }`}
                onClick={handleToggle}
              >
                Login
              </button>
              <button
                className={`${styles.tabButton} ${
                  isRegistering ? styles.activeTab : ""
                }`}
                onClick={handleToggle}
              >
                Register
              </button>
            </div>
            <form className={styles.loginForm}>
              {isRegistering && (
                <div className={styles.nameFields}>
                  <input
                    type="text"
                    id="firstName"
                    value={formValues.firstName}
                    onChange={handleChange}
                    className={`${styles.inputField} ${styles.nameField}`}
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    id="lastName"
                    value={formValues.lastName}
                    onChange={handleChange}
                    className={`${styles.inputField} ${styles.nameField}`}
                    placeholder="Last Name"
                  />
                </div>
              )}
              <input
                type="text"
                id="username"
                value={formValues.username}
                onChange={handleChange}
                className={styles.inputField}
                placeholder="Username"
              />
              {isRegistering && (
                <input
                  type="email"
                  id="email"
                  value={formValues.email}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder="Email"
                />
              )}
              <input
                type="password"
                id="password"
                value={formValues.password}
                onChange={handleChange}
                className={`${styles.inputField} ${styles.passwordField}`}
                placeholder="Password"
              />
              {isRegistering && (
                <input
                  type="password"
                  id="confirmPassword"
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  className={`${styles.inputField} ${styles.passwordField}`}
                  placeholder="Confirm Password"
                />
              )}
              <button type="submit" className={styles.loginButton}>
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
