import styles from "./Profile.module.css";
import StudentProfile from "./StudentProfile/StudentProfile";
import studentImg from "../../images/ProfilePage/student.png";
import tutorImg from "../../images/ProfilePage/tutor.png";
import TutorProfile from "./TutorProfile/TutorProfile";
import { useAuth } from "../../contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getStudentById } from "../../proxies/students";
import { getTutorById } from "../../proxies/tutors";

export default function Profile() {
    const { loggedInUser, updateLoggedInUser } = useAuth();
    const [isloggedInUser, setisLoggedInUser] = useState(false);
    const [user, setUser] = useState(null);
    const userId = useParams().id;
    const userRole = useParams().role;
    let navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            // fetch user data
            if (userRole === "Student") {
                const response = await getStudentById(userId);
                console.log("setting student as user: ", response.data.user);
                setUser(response.data.user);
            }
            else if (userRole === "Tutor") {
                const response = await getTutorById(userId);
                console.log("setting tutor as user: ", response.data.user);
                setUser(response.data.user);
            }
            else {
                console.log("Invalid user role");
                console.log("logged in user: ", loggedInUser);
                console.log("logged in userrole: ", loggedInUser.role);
                setUser(loggedInUser);
            }
        }
        fetchUser();
    }, [userId, userRole, loggedInUser]);

    useEffect(() => {
        if (user && loggedInUser && loggedInUser._id === user._id) {
            setisLoggedInUser(true);
        }
        else {
            setisLoggedInUser(false);
        }
        console.log("user: ", user);
    }, [user, isloggedInUser, loggedInUser])

    function handleClick() {
        navigate(-1);
    }

    return (
        <div className={styles.profileContainer}>
            <div>
                <button className={styles.backBtn} onClick={handleClick}>Back</button>
                {user && (
                    <div className={styles.profileDetailsContainer}>
                        {user.role === "Student" ? (
                            <StudentProfile
                                isloggedIn={isloggedInUser}
                                loggedInUser={loggedInUser}
                                updateLoggedInUser={updateLoggedInUser}
                                studentInfo={user}
                                img={studentImg}
                            />
                        ) : (
                            <TutorProfile
                                isloggedIn={isloggedInUser}
                                loggedInUser={loggedInUser}
                                updateLoggedInUser={updateLoggedInUser}
                                tutorInfo={user}
                                img={tutorImg}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}