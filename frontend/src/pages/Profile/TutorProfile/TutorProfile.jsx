import { useState, useEffect } from "react";
import ProfileImage from "../../../components/ProfileImage/ProfileImage";
import styles from "./TutorProfile.module.css";

import { getChat } from "../../../proxies/chats";
import { useNavigate } from "react-router-dom";
import { getTutorById, editTutorProfile } from '../../../proxies/tutors';




export default function TutorProfile({ isloggedIn, loggedInUser, tutorInfo, img }) {
    const { fullName, bio, subjects, rating, rate } = tutorInfo;
    const [isEditing, setIsEditing] = useState(false);
    const [editedFullName, setEditedFullName] = useState(fullName);
    const [editedBio, setEditedBio] = useState(bio);
    const [editedSubjects, setEditedSubjects] = useState(subjects.join(", "));
    const [editedRate, setEditedRate] = useState(rate);
    
    const navigate = useNavigate();

    // Function to toggle editing mode
    function editProfile() {
        setIsEditing(!isEditing);
    }

    // Function to handle form submission (update profile)
    async function handleSaveProfile() {
  try {
    const updatedTutorData = {
      fullName: editedFullName,
      bio: editedBio,
      subjects: editedSubjects.split(", ").map((subject) => subject.trim()),
      rate: editedRate,
    };

    // Call the API to update the profile
    const response = await editTutorProfile(tutorInfo._id, updatedTutorData);
    console.log("Profile updated successfully:", response);

    // After saving, set editing mode to false
    setIsEditing(false);
  } catch (error) {
    console.error("Error updating profile:", error);
  }
}


    async function handleMessageButtonClicked() {
        // get the chat with the user
        const chat = await getChat(loggedInUser, tutorInfo);
        if (!chat) {
            console.log("Error getting chat");
            alert("Error getting chat");
            return;
        }

        // navigate to the chat page
        navigate(`/communication/${chat._id}`);
    }

    return (
        <div className={styles.tutorProfileContainer}>
            <div className={styles.tutorProfile}>
                <ProfileImage src={img} alt={"Profile image of the tutor"} />
                <h2>{isEditing ? (
                    <input
                        type="text"
                        value={editedFullName}
                        onChange={(e) => setEditedFullName(e.target.value)}
                    />
                ) : fullName}</h2>
                {isloggedIn && <button onClick={editProfile}>{isEditing ? "Cancel" : "Edit Profile"}</button>}
            </div>

            <div>
                <h2>Bio</h2>
                {isEditing ? (
                    <textarea
                        value={editedBio}
                        onChange={(e) => setEditedBio(e.target.value)}
                    />
                ) : (
                    <p>{bio}</p>
                )}
            </div>

            <div>
                <h2>What I Tutor</h2>
                {isEditing ? (
                    <textarea
                        value={editedSubjects}
                        onChange={(e) => setEditedSubjects(e.target.value)}
                    />
                ) : (
                    subjects.map((item) => <p key={item}>{item}</p>)
                )}
            </div>

            <div className={styles.reviewContainer}>
                <h2>Reviews</h2>
                <div className={styles.ratingContainer}>
                    <h3 className={styles.rating}>{rating}</h3>
                </div>
            </div>

            <div>
                <h2>Hourly Rate</h2>
                {isEditing ? (
                    <input
                        type="number"
                        value={editedRate}
                        onChange={(e) => setEditedRate(e.target.value)}
                    />
                ) : (
                    <p>RM {rate}</p>
                )}
            </div>

            <div>
                {isEditing && <button onClick={handleSaveProfile}>Save Profile</button>}
            </div>

            {!isloggedIn && <div className={styles.contactSection}>
                <h2>Contact Me:</h2>
                <button onClick={handleMessageButtonClicked}>Message</button>
            </div>}
        </div>
    );
}
