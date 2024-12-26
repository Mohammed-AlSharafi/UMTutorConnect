import { useState, useEffect } from "react";
import ProfileImage from "../../../components/ProfileImage/ProfileImage";
import styles from "./TutorProfile.module.css";
import { getChat } from "../../../proxies/chats";
import { useNavigate } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { getTutorById, updateRating, editTutorProfile } from "../../../proxies/tutors";
import { allowedFileTypes, getResourceType, getThumbnailUrl, uploadFile } from "../../../proxies/fileHandler";

export default function TutorProfile({
  isloggedIn,
  loggedInUser,
  updateLoggedInUser,
  tutorInfo,
}) {
  const { firstName, lastName, fullName, bio, profilePicture, subjects, averageRating, rate, role } = tutorInfo;
  const [isEditing, setIsEditing] = useState(false);
  const [editedfirstName, setEditedFirstName] = useState(firstName);
  const [editedlastName, setEditedlastName] = useState(lastName);
  const [editedBio, setEditedBio] = useState(bio);
  const [editedSubjects, setEditedSubjects] = useState(subjects.join(", "));
  const [editedRate, setEditedRate] = useState(rate);
  const [editedProfilePicture, setEditedProfilePicture] = useState(profilePicture);

  // set the initial star rating to the current users rating for this tutor
  const [starRating, setStarRating] = useState(
    tutorInfo.ratings.find((student) => {
      return student.studentId === loggedInUser._id;
    }
    )?.rating || 0
  )

  const navigate = useNavigate();

  const changeRating = async (newRating) => {
    const updatedTutorInfo = await updateRating(tutorInfo._id, loggedInUser._id, newRating);
    console.log("updatedTutorInfo: ", updatedTutorInfo)
    tutorInfo.averageRating = updatedTutorInfo.averageRating;

    // update state after updating tutorInfo
    setStarRating(newRating);
  }

  // Function to toggle editing mode
  function editProfile() {
    // if editing, means its being cancelled,
    // so reset the edited values to the current values
    if (isEditing) {
      setEditedProfilePicture(profilePicture);
      setEditedFirstName(firstName);
      setEditedlastName(lastName);
      setEditedBio(bio);
      setEditedSubjects(subjects.join(", "));
      setEditedRate(rate);
    }
    setIsEditing(!isEditing);
  }

  async function handleProfilePictureChange(event) {
    const fileToUpload = event.target.files[0];
    if (!allowedFileTypes.includes(fileToUpload.type)) {
      alert("Receipt: Invalid file format.");
      // setFileToUpload(null);
      return;
    }
    // ensure file size is below 3MB
    if (fileToUpload.size > 3 * 1024 * 1024) {
      alert("Receipt: File size too large.");
      // setFileToUpload(null);
      return;
    }

    // upload the file
    try {
      const resourceType = getResourceType(fileToUpload.type);
      const uploadedFile = await uploadFile(fileToUpload, resourceType);
      console.log("file that just got uploaded", uploadedFile);
      setEditedProfilePicture(getThumbnailUrl(uploadedFile.secure_url));

    } catch (error) {
      // for now just alert
      if (error.response) {
        alert(`Error uploading file: ${error.response.data.error.message}.`);
      }
      else {
        alert(`Error uploading file: ${error.message}.`);
      }
      // -> "Error uploading file: Empty file"
      return;
    }
  }

  // Function to handle form submission (update profile)
  async function handleSaveProfile() {
    try {
      const updatedTutorData = {
        firstName: editedfirstName,
        lastName: editedlastName,
        fullName: `${editedfirstName} ${editedlastName}`,
        bio: editedBio,
        subjects: editedSubjects.split(", ").map((subject) => subject.trim()),
        rate: editedRate,
        profilePicture: editedProfilePicture
      };
      tutorInfo = { ...tutorInfo, ...updatedTutorData };

      // Call the API to update the profile
      const tutor = await editTutorProfile(tutorInfo._id, updatedTutorData);
      console.log("Profile updated successfully:", tutor);

      updateLoggedInUser(tutor);

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
        <ProfileImage
          src={isEditing ? editedProfilePicture : profilePicture}
          alt="Profile Image of the student"
          isEditing={isEditing}
          onProfilePictureChange={handleProfilePictureChange}
        />
        {!isEditing && <h2>{fullName}</h2>}
        {isEditing && (
          <>
            <h2>
              <input
                type="text"
                value={editedfirstName}
                onChange={(e) => setEditedFirstName(e.target.value)}
              />
            </h2>
            <h2>
              <input
                type="text"
                value={editedlastName}
                onChange={(e) => setEditedlastName(e.target.value)}
              />
            </h2>
          </>
        )}
        <p>{role}</p>
        {/* <h2>{isEditing ? (
                    <input
                        type="text"
                        value={editedfirstName}
                        onChange={(e) => setEditedFirstName(e.target.value)}
                    />
                ) : firstName}</h2>

                <h2>{isEditing ? (
                    <input
                        type="text"
                        value={editedlastName}
                        onChange={(e) => setEditedlastName(e.target.value)}
                    />
                ) : lastName}</h2> */}
        {/* {isloggedIn && (
          <button onClick={editProfile}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        )} */}


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
        <h2>Rating</h2>
        <div className={styles.ratingContainer}>
          <h3 className={styles.rating}>{averageRating}</h3>
        </div>
      </div>

      <div>
        <h2>Hourly Rate</h2>
        {isEditing ? (
          <textarea
            type="number"
            value={editedRate}
            onChange={(e) => setEditedRate(e.target.value)}
          />
        ) : (
          <p>RM {rate}</p>
        )}
      </div>

      {/* <div>
        {isEditing && <button onClick={handleSaveProfile}>Save Profile</button>}
      </div> */}
      {tutorInfo.students.find((student) => {
        return student._id === loggedInUser._id;
      }) && (
          <div className={styles.starContainer}>
            <StarRatings
              rating={starRating}
              starRatedColor="gold"
              changeRating={changeRating}
              numberOfStars={5}
              name="rating"
            />
          </div>
        )}
      {!isloggedIn && (
        <div className={styles.contactSection}>
          <h2>Contact Me:</h2>
          <button onClick={handleMessageButtonClicked}>Message</button>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
              {isloggedIn && (
              <>
                  <button onClick={editProfile}>
                  {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                  {isEditing && (
                  <button onClick={handleSaveProfile}>Save Profile</button>
                  )}
              </>
              )}
          </div>
    </div>

              

  );
}
