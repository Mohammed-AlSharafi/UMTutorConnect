import { useState, useEffect } from "react";
import ProfileImage from "../../../components/ProfileImage/ProfileImage";
import styles from "./StudentProfile.module.css";
import { useNavigate } from "react-router-dom";
import { addStudent } from "../../../proxies/tutors";
import { removeStudent } from "../../../proxies/tutors";
import { getStudentById, editStudentProfile } from "../../../proxies/students";

export default function StudentProfile({ isloggedIn, loggedInUser, updateLoggedInUser, img, studentInfo }) {

    const { _id, firstName, lastName, email, fullName, role } = studentInfo;

    const [isEditing, setIsEditing] = useState(false);

    const [editedFirstName, setEditedFirstName] = useState(firstName);
    const [editedLastName, setEditedLastName] = useState(lastName);
    const [editedEmail, setEditedEmail] = useState(email);

    const navigate = useNavigate();

    // Toggle editing mode
    function handleEditProfile() {
        setIsEditing(!isEditing);
    }

    // Save profile changes
    async function handleSaveProfile() {
        try {
            const updatedStudentData = {
                firstName: editedFirstName,
                lastName: editedLastName,
                fullName: `${editedFirstName} ${editedLastName}`,
                email: editedEmail,
            };

            // Call the API to update the student profile
            const updatedStudent = await editStudentProfile(_id, updatedStudentData);
            console.log("Profile updated successfully:", updatedStudent);

            // Update the logged-in user's information with the new data
            updateLoggedInUser({
                ...loggedInUser,
                ...updatedStudent,
            });

            // Exit editing mode
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    }

    // function handleEditProfile() {
    //     //implement edit profile
    // }

    async function handleAddStudent() {
        //implement add student
        if (loggedInUser.role === "Tutor") {
            const tutor = await addStudent(_id, loggedInUser._id);
            updateLoggedInUser({
                ...loggedInUser,
                students: [...loggedInUser.students, studentInfo]
            });
        }
    }

    async function handleRemoveStudent() {
        //implement remove student
        if (loggedInUser.role === "Tutor") {
            const tutor = await removeStudent(_id, loggedInUser._id);
            updateLoggedInUser({
                ...loggedInUser,
                students: loggedInUser.students.filter((student) => student._id !== _id)
            });
        }
    }

    function containsStudent(loggedInUser, id) {
        if (loggedInUser.role === "Tutor") {
            console.log("tutor.students: ", loggedInUser.students);
            for (let student of loggedInUser.students) {
                if (student._id === id) {
                    return true;
                }
            }
        }
        return false;
    }

    return (
        <div className={styles.studentProfileContainer}>
          {/* Profile Section */}
          <div className={styles.studentProfile}>
            <ProfileImage src={img} alt="Profile Image of the student" />
      
            {/* Full Name: Editable or Static */}
            {isEditing ? (
              <>
                <h2>
                  <input
                    type="text"
                    value={editedFirstName}
                    onChange={(e) => setEditedFirstName(e.target.value)}
                    placeholder="First Name"
                  />
                </h2>
                <h2>
                  <input
                    type="text"
                    value={editedLastName}
                    onChange={(e) => setEditedLastName(e.target.value)}
                    placeholder="Last Name"
                  />
                </h2>
              </>
            ) : (
              <h2>{fullName}</h2>
            )}

            {/* Role */}
            <p>{role}</p>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
                {isloggedIn && (
                <>
                    <button onClick={handleEditProfile}>
                    {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                    {isEditing && (
                    <button onClick={handleSaveProfile}>Save Profile</button>
                    )}
                </>
                )}
                {!isloggedIn && !containsStudent(loggedInUser, _id) && (
                <button onClick={handleAddStudent}>Add Student</button>
                )}
                {!isloggedIn && containsStudent(loggedInUser, _id) && (
                <button onClick={handleRemoveStudent}>Remove Student</button>
                )}
            </div>

          </div>

        {/* Email: Editable or Static */}
        <div className={styles.profileDetailsContainer}>
              <h2>Email</h2>
              {isEditing ? (
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  placeholder="Email Address"
                />
              ) : (
                <p>{email}</p>
              )}
        </div>  
      
        {/* Current Studies Section */}
        <div className={styles.profileDetailsContainer}>
            <h2>Current Studies</h2>
            <p>2nd Year Bachelor of Computer Science</p>
            <p>Artificial Intelligence</p>
        </div>






    </div>




    );
      
      
}