import ProfileImage from "../../../components/ProfileImage/ProfileImage";
import styles from "./StudentProfile.module.css";
import { addStudent, removeStudent } from "../../../proxies/tutors";
import { editStudentProfile } from "../../../proxies/students";
import { useState } from "react";


export default function StudentProfile({ isloggedIn, loggedInUser, updateLoggedInUser, img, studentInfo }) {

    const { _id, firstName, lastName, background, fullName, role } = studentInfo;
    const [isEditing, setIsEditing] = useState(false);
    const [editedfirstName, setEditedFirstName] = useState(firstName);
    const [editedlastName, setEditedlastName] = useState(lastName);
    const [editedBackground, setEditedBackground] = useState(background);

    function handleEditProfile() {
        //implement edit profile
        setIsEditing(!isEditing);
    }

    async function handleSaveProfile() {
        //implement save profile
        try {
            const updatedStudentData = {
                firstName: editedfirstName,
                lastName: editedlastName,
                fullName: `${editedfirstName} ${editedlastName}`,
                background: editedBackground,
            };
            studentInfo = { ...studentInfo, ...updatedStudentData };

            const student = await editStudentProfile(_id, updatedStudentData);
            console.log("student: ", student);

            updateLoggedInUser(student);

            // after saving, set editing mode to false
            setIsEditing(!isEditing);
        }
        catch (error) {
            console.error(error);
        }
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

    function containsStudent(loggedInUser, id) {
        if (loggedInUser.role === "Tutor") {
            console.log("tutor.students: ", loggedInUser.students);
            for (let student of loggedInUser.students) {
                if (student._id === id) {
                    return true;
                }
            }
        }
        return false;
    }

    return (
        <div>
            <div className={styles.studentProfile}>
                <ProfileImage src={img} alt="Profile Image of the student" />
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
                {isloggedIn && (
                    <button onClick={handleEditProfile}>
                        {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                )}
                {!isloggedIn && !containsStudent(loggedInUser, _id) && <button onClick={handleAddStudent}>Add Student</button>}
                {!isloggedIn && containsStudent(loggedInUser, _id) && <button onClick={handleRemoveStudent}>Remove Student</button>}
            </div>

            <div>
                <h2>Background</h2>
                {isEditing ? (
                    <textarea
                        value={editedBackground}
                        onChange={(e) => setEditedBackground(e.target.value)}
                    />
                ) : (
                    <p>{background}</p>
                )}
                {/* <p>{background}</p> */}
                {/* <p>2nd Year Bachelor of Computer Science</p>
                <p>Artificial Intelligence</p> */}

                <div>
                    {isEditing && <button onClick={handleSaveProfile}>Save Profile</button>}
                </div>
            </div>
        </div>
    );
}