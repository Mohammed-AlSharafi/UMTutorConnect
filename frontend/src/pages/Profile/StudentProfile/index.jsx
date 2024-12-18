import ProfileImage from "../../../components/ProfileImage/ProfileImage";
import styles from "./StudentProfile.module.css";
import { useNavigate } from "react-router-dom";



export default function StudentProfile({ img, studentInfo }) {
    const navigate = useNavigate();

    const dateUpdated = studentInfo.dateUpdated;

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
    
    return (
        <div>
            <div className={styles.studentProfile}>
                <ProfileImage src={img} alt="Profile Image of the student"/>
                <h2>{studentInfo.fullName}</h2>
                <p>{studentInfo.role}</p>
                <button 
                onClick={() => navigate("/profile/edit")}
                className={styles.editBtn}>Edit Profile</button>
            </div>

            <div>
                <h2>Current Studies</h2>
                <p>2nd Year Bachelor of Computer Science</p>
                <p>Artificial Intelligence</p>
            </div>

            <div>
                <h5>Updated at: {formattedDate}</h5>
            </div>
        </div>
    );
}