import React, { useState } from "react";
import styles from "./Authentication.module.css";

const Authentication = () => {
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and registration

  const handleToggle = () => {
    setIsRegistering(!isRegistering); // Toggle between login and registration
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
                className={`${styles.tabButton} ${!isRegistering ? styles.activeTab : ""}`}
                onClick={handleToggle}
              >
                Login
              </button>
              <button
                className={`${styles.tabButton} ${isRegistering ? styles.activeTab : ""}`}
                onClick={handleToggle}
              >
                Register
              </button>
            </div>

            {/* Toggle between Login and Registration */}
            {isRegistering ? (
              <form className={styles.loginForm}>
                <div className={styles.nameFields}>
                  <input
                    type="text"
                    id="firstName"
                    className={`${styles.inputField} ${styles.nameField}`}
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    id="lastName"
                    className={`${styles.inputField} ${styles.nameField}`}
                    placeholder="Last Name"
                  />
                </div>
                <input
                  type="email"
                  id="email"
                  className={styles.inputField}
                  placeholder="Email"
                />
                <input
                  type="password"
                  id="password"
                  className={`${styles.inputField} ${styles.passwordField}`}
                  placeholder="Password"
                />
                <input
                  type="password"
                  id="confirmPassword"
                  className={`${styles.inputField} ${styles.passwordField}`}
                  placeholder="Confirm Password"
                />
                <button type="submit" className={styles.loginButton}>
                  Register
                </button>
              </form>
            ) : (
              <form className={styles.loginForm}>
                <input
                  type="text"
                  id="username"
                  className={styles.inputField}
                  placeholder="Username"
                />
                <input
                  type="password"
                  id="password"
                  className={`${styles.inputField} ${styles.passwordField}`}
                  placeholder="Password"
                />
                <button type="submit" className={styles.loginButton}>
                  Login
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Authentication;
