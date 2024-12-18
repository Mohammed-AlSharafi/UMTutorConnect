import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom"; 
import axios from 'axios'; 
import { useAuth } from "../../contexts/AuthContext";

function EditProfile() {
  const navigate = useNavigate();
  const baseURL = 'http://localhost:3001/';
  const { user } = useAuth();
  console.log('User username:', user.username);
  const username = user.username;
  console.log('User id:', user._id);
  const id = user._id;
  const role = user.role;

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    // Tutor-specific fields
    bio: '',
    subjects: [],
    rate: 10,
    // Student-specific fields
    course: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  // Example using axios to fetch tutor profile by username
  //const { user } = useAuth(); // Assuming user object contains username
  
  // Fetch current profile data when the component mounts
  useEffect(() => {
    //      const response = await axios.get(`http://localhost:3001/tutorApi/update/${user.username}`);

    axios.get(`${baseURL}${role === 'Tutor' ? 'TutorApi' : 'StudentApi'}/${id}`)
      .then((response) => {
        console.log('Receiving Profile data:', response.data);
        setProfileData(response.data); 
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to fetch profile data.');
        console.log("error: ", error);
        setLoading(false);
      });
  },[username, id]);

  // // Fetch tutor profile (GET request)
  // axios.get(`/api/${username}`)
  //   .then(response => {
  //     console.log(response.data); // This is the tutor profile data
  //     // You can now pre-fill the form with this data
  //   })
  //   .catch(error => {
  //     console.error("Error fetching profile:", error);
  //   });

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  // Handle subjects array for tutor role
  const handleSubjectsChange = (e) => {
    const { value } = e.target;
    setProfileData({
      ...profileData,
      subjects: value.split(',').map(subject => subject.trim())  // Split subjects by commas
    });
  };

  // Form validation
  const validateForm = () => {
    if (!profileData.firstName || !profileData.lastName || !profileData.email) {
      setFormError('First Name, Last Name, and Email are required.');
      return false;
    }
    if (user.role === 'Tutor' && !profileData.bio) {
      setFormError('Bio is required for Tutors.');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateForm()) return;

    console.log('Submitting:', profileData);
    axios.put(`${baseURL}${role === 'Tutor' ? 'TutorApi' : 'StudentApi'}/update/${username}`, profileData)
      .then((response) => {
        console.log('Profile updated:', response.data);
        navigate("/profile"); // Redirect to the profile page after update
        //navigate("/profile", { state: { tutorData: response.data.tutor } }); // Redirect to the profile page after update
      })
      .catch((error) => {
        console.log("error: ", error);
        setError('Failed to update profile.');
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profileData) {
    return <div>Error: Profile data not available.</div>;
  }

  return (
    <div>
      <h1>Edit Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {formError && <p style={{ color: 'red' }}>{formError}</p>}

      <form onSubmit={handleSubmit}>
        {/* Common fields for both Student and Tutor */}
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={profileData.firstName}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={profileData.lastName}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
          />
        </label>
        <br />

        {/* Conditional rendering based on user role */}
        {user.role === 'Tutor' && (
          <>
            <label>
              Bio:
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Subjects (comma separated):
              <input
                type="text"
                name="subjects"
                value={profileData.subjects.join(', ')}
                onChange={handleSubjectsChange}
              />
            </label>
            <br />
            <label>
              Rate per hour:
              <input
                type="number"
                name="rate"
                value={profileData.rate}
                onChange={handleChange}
              />
            </label>
            <br />
          </>
        )}

        {user.role === 'Student' && (
          <>
            <label>
              Course:
              <input
                type="text"
                name="course"
                value={profileData.course}
                onChange={handleChange}
              />
            </label>
            <br />
          </>
        )}

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditProfile;
