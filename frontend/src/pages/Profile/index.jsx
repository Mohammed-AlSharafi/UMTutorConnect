import styles from "./Profile.module.css";
import StudentProfile from "./StudentProfile";
import TutorProfile from "./TutorProfile";
import studentImg from "../../images/ProfilePage/student.png";
import tutorImg from "../../images/ProfilePage/tutor.png";
import { useAuth } from "../../contexts/AuthContext";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // To make API calls

export default function Profile() {
  const { user, login } = useAuth(); // Access user data and login function from context
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseURL = 'http://localhost:3001/';
  
  const fetchedData = useRef(false); // Flag to track whether data has been fetched

  // Fetch the latest user data whenever the profile page is visited
  useEffect(() => {
    if (user && !fetchedData.current) {
      fetchedData.current = true; // Set flag to true after data is fetched once

      const fetchUserData = async () => {
        try {
          setLoading(true);          
          const response = await axios.get(`${baseURL}${user.role === 'Tutor' ? 'tutorApi' : 'studentApi'}/${user._id}`); // Use the user ID to fetch updated profile data
          login(response.data, sessionStorage.getItem('token')); // Update user context with the new data
          setLoading(false);
        } catch (err) {
          console.error('Error fetching user data:', err);
          console.log('Error response:', err.response);
          setError('Failed to load user data.');
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [user, login]); // Only rerun if `user` changes (not on every render)

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileDetailsContainer}>
        {user.role === "Student" ? (
          <StudentProfile studentInfo={user} img={studentImg} />
        ) : (
          <TutorProfile tutorInfo={user} img={tutorImg} />
        )}
      </div>
    </div>
  );
}
