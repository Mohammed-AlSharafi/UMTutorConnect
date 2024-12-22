import { useState, useEffect } from "react";
import ProfileImage from "../../../components/ProfileImage/ProfileImage";
import styles from "./TutorProfile.module.css";
import { getChat } from "../../../proxies/chats";
import { useNavigate } from "react-router-dom";
import StarRatings from "react-star-ratings";

export default function TutorProfile({
  isloggedIn,
  loggedInUser,
  tutorInfo,
  img,
}) {
  const [starRating, setStarRating] = useState(0);
  const { fullName, bio, subjects, rating, rate } = tutorInfo;
  const navigate = useNavigate();

  function editProfile() {
    //implement edit profile
  }

  const changeRating = (newRating) => {
    setStarRating(newRating);
  };

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
        <h2>{fullName}</h2>
        {isloggedIn && <button onClick={editProfile}>Edit Profile</button>}
      </div>

      <div>
        <h2>Bio</h2>
        <p>{bio}</p>
      </div>

      <div>
        <h2>What I Tutor</h2>
        {subjects.map((item) => {
          return <p>{item}</p>;
        })}
      </div>

      <div className={styles.reviewContainer}>
        <h2>Reviews</h2>
        <div className={styles.ratingContainer}>
          <h3 className={styles.rating}>{rating}</h3>
          {/* <h3>--</h3> */}
        </div>
      </div>

      <div>
        <h2>Hourly Rate</h2>
        <div className={styles.hourlyRate}>
          <p>RM {rate}</p>
        </div>
      </div>
      {tutorInfo.students.find((student)=>{
        return student._id === loggedInUser._id
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
    </div>
  );
}
