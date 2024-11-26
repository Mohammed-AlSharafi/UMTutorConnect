import styles from "./Profile.module.css";
import StudentProfile from "./StudentProfile";
import studentImg from "../../images/ProfilePage/student.png";
import tutorImg from "../../images/ProfilePage/tutor.png";
import { useState } from "react";
import TutorProfile from "./TutorProfile";

export default function Profile() {

    //Some sort of ID to be passed into there
    //Temporary solution
    //Student = 1, Tutor = 2
    const id = 2;

    const [tutorInfo, setTutorInfo] = useState({
        name: "Alicia Tan",
        bio: "Experienced in Java and mathematics tutoring, dedicated to simplifying complex concepts for university and high school students alike",
        subjects: [
            "MAD2007",
            "WIX2002",
            "WIA2001"
        ],
        rating: "4.0",
        hourly_rate: 20,
    });

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileDetailsContainer}>
                {id == 1? <StudentProfile img={studentImg} /> : <TutorProfile tutorInfo={tutorInfo} img={tutorImg}/>}
            </div>
        </div>
    );
}