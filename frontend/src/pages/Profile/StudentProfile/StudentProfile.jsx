import ProfileImage from "../../../components/ProfileImage/ProfileImage";
import styles from "./StudentProfile.module.css";
import { addStudent } from "../../../proxies/tutors";
import { removeStudent } from "../../../proxies/tutors";

export default function StudentProfile({ isloggedIn, loggedInUser, updateLoggedInUser, img, studentInfo }) {

    const { _id, fullName, role } = studentInfo;

    function handleEditProfile() {
        //implement edit profile
    }

    async function handleAddStudent() {
        //implement add student
        if (loggedInUser.role === "Tutor") {
            const tutor = await addStudent(_id, loggedInUser._id);
            updateLoggedInUser({
                ...loggedInUser,
                students: [...loggedInUser.students, studentInfo]
            });
        }
    }

    async function handleRemoveStudent() {
        //implement remove student
        if (loggedInUser.role === "Tutor") {
            const tutor = await removeStudent(_id, loggedInUser._id);
            updateLoggedInUser({
                ...loggedInUser,
                students: loggedInUser.students.filter((student) => student._id !== _id)
            });
        }
    }

    function containsStudent(tutor, id) {
        console.log("tutor.students: ", tutor.students);
        for (let student of tutor.students) {
            if (student._id === id) {
                return true;
            }
        }
        return false;
    }

    return (
        <div>
            <div className={styles.studentProfile}>
                <ProfileImage src={img} alt="Profile Image of the student" />
                <h2>{fullName}</h2>
                <p>{role}</p>
                {isloggedIn && <button onClick={handleEditProfile}>Edit Profile</button>}
                {!isloggedIn && !containsStudent(loggedInUser, _id) && <button onClick={handleAddStudent}>Add Student</button>}
                {!isloggedIn && containsStudent(loggedInUser, _id) && <button onClick={handleRemoveStudent}>Remove Student</button>}
            </div>

            <div>
                <h2>Current Studies</h2>
                <p>2nd Year Bachelor of Computer Science</p>
                <p>Artificial Intelligence</p>
            </div>
        </div>
    );
}