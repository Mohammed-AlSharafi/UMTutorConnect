import ProfileImage from "../../../components/ProfileImage/ProfileImage";
import styles from "./TutorProfile.module.css";

export default function TutorProfile({ tutorInfo, img }) {
    const { name, bio, subjects, rating, hourly_rate } = tutorInfo;

    return (
        <div className={styles.tutorProfileContainer}>
            <div className={styles.tutorProfile}>
                <ProfileImage src={img} alt={"Profile image of the tutor"}/>
                <h2>{name}</h2>
                <button>Edit Profile</button>
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
                    <h3>Rating</h3>
                </div>
            </div>

            <div>
                <h2>Hourly Rate</h2>
                <div className={styles.hourlyRate}>
                    <p>RM {hourly_rate}</p>
                </div>
            </div>

            <div>
                <h2>Contact Me:</h2>
                <button>Message</button>
            </div>
        </div>
    );
}