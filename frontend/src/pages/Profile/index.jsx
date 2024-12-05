import styles from "./Profile.module.css";
import StudentProfile from "./StudentProfile";
import studentImg from "../../images/ProfilePage/student.png";
import tutorImg from "../../images/ProfilePage/tutor.png";
import TutorProfile from "./TutorProfile";
import { useAuth } from "../../contexts/AuthContext";

export default function Profile() {
    const { user } = useAuth();

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileDetailsContainer}>
                {user.role === "Student" ? <StudentProfile img={studentImg} /> : <TutorProfile tutorInfo={user} img={tutorImg}/>}
            </div>
        </div>
    );
}