import ProfileImage from "../../../components/ProfileImage/ProfileImage";
import styles from "./StudentProfile.module.css";

export default function StudentProfile({ isloggedIn, img, studentInfo }) {

    function editProfile() {
        //implement edit profile
    }

    function addStudent() {
        //implement add student
    }

    return (
        <div>
            <div className={styles.studentProfile}>
                <ProfileImage src={img} alt="Profile Image of the student"/>
                <h2>{studentInfo.fullName}</h2>
                <p>{studentInfo.role}</p>
                {isloggedIn && <button onClick={editProfile}>Edit Profile</button>}
                {!isloggedIn && <button onClick={addStudent}>Add Student</button>}
            </div>

            <div>
                <h2>Current Studies</h2>
                <p>2nd Year Bachelor of Computer Science</p>
                <p>Artificial Intelligence</p>
            </div>
        </div>
    );
}