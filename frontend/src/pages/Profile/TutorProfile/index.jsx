import ProfileImage from "../../../components/ProfileImage/ProfileImage";
import styles from "./TutorProfile.module.css";
import { useNavigate } from "react-router-dom";

export default function TutorProfile({ tutorInfo, img }) {
    
    const { fullName, bio, subjects, rating, rate } = tutorInfo;
    const navigate = useNavigate();

    // Profile Edit Start
    const dateUpdated = tutorInfo.dateUpdated;

    // Check if the date is valid
    const isValidDate = !isNaN(new Date(dateUpdated).getTime());
  
    let formattedDate = 'Date not available'; // Default message if the date is invalid
  
    if (isValidDate) {
      // Create a Date object
      const dateObj = new Date(dateUpdated);
  
      // Get options for formatting the date in a specific timezone (e.g., GMT+2)
      const options = {
        weekday: 'short', // Example: 'Mon'
        year: 'numeric',
        month: 'long', // Example: 'January'
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        //second: '2-digit',
        hour12: true, // AM/PM format
        timeZoneName: 'short', // Example: 'GMT'
        timeZone: 'GMT', // Use GMT timezone
      };
  
      // Format the date using toLocaleString
      const localeDate = dateObj.toLocaleString('en-GB', options);
    
      // Replace the am/pm part with uppercase version (AM/PM)
      formattedDate = localeDate.replace(/(\s)(am|pm)/i, (match, p1, p2) => {
      return p1 + p2.toUpperCase();
      });
  
      // Format it like "Wed, 18 December 2024, at 01:52 AM UTC"
      formattedDate = formattedDate.replace(' at', ', at ');
      formattedDate = formattedDate.replace(/^(.{3})(.)/, '$1, ');
    }
    // Profile Edit Date Done

    return (
        <div className={styles.tutorProfileContainer}>
            <div className={styles.tutorProfile}>
                <ProfileImage src={img} alt={"Profile image of the tutor"}/>
                <h2>{fullName}</h2>
                <button
                    //className={styles.editButton}
                    onClick={() => navigate("/profile/edit")}
                >
                    Edit Profile
                </button>
            </div>

            <div>
                <h2>Bio</h2>
                <p>{bio}</p>
            </div>

            <div>
                <h2>What I Tutor</h2>
                {subjects.map((item) => {
                    return(
                        <p>{item}</p>
                    );
                })}
            </div>

            <div className={styles.reviewContainer}>
                <h2>Reviews</h2>
                <div className={styles.ratingContainer}>
                    <h3 className={styles.rating}>{rating}</h3>
                    <h3>--</h3>
                </div>
            </div>

            <div>
                <h2>Hourly Rate</h2>
                <div className={styles.hourlyRate}>
                    <p>RM {rate}</p>
                </div>
            </div>

            <div className={styles.contactSection}>
                <h2>Contact Me:</h2>
                <button>Message</button>
            </div>

            <div>
                <h5>Updated at: {formattedDate}</h5>
            </div>

        </div>
    );
}