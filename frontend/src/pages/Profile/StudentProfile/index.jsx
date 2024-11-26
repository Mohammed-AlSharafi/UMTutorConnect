import ProfileImage from "../../../components/ProfileImage/ProfileImage";
import styles from "./StudentProfile.module.css";

export default function StudentProfile({ img }) {
    return (
        <div>
            <div className={styles.studentProfile}>
                <ProfileImage src={img} alt="Profile Image of the student"/>
                <h2>John Smith</h2>
                <p>Student</p>
                <button className={styles.editBtn}>Edit Profile</button>
            </div>

            <div>
                <h2>Current Studies</h2>
                <p>2nd Year Bachelor of Computer Science</p>
                <p>Artificial Intelligence</p>
            </div>
        </div>
    );
}