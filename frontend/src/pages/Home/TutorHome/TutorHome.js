import styles from "./TutorHome.module.css";
import UserList from "../../../components/HomePage/UserList/UserList";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect, useState } from "react";

import { getStudents } from "../../../proxies/tutors";

export default function TutorHome() {
  const { loggedInUser } = useAuth();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  // const topTutors = [
  //   {
  //     fullName: "John Doe",
  //     role: "Tutor",
  //     subjects: "Data Structures",
  //     rate: 20,
  //     img: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   },
  //   {
  //     fullName: "Jane Smith",
  //     role: "Tutor",
  //     subjects: "Algorithms",
  //     rate: 25,
  //     img: "https://plus.unsplash.com/premium_photo-1658506795539-8c3e055c960c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   },
  //   {
  //     fullName: "Chris Lee",
  //     role: "Tutor",
  //     subjects: "Machine Learning",
  //     rate: 30,
  //     img: "https://images.unsplash.com/photo-1495603889488-42d1d66e5523?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   },
  // ];

  useEffect(() => {
    const fetchInitialStudents = async () => {
      try {
        const students = await getStudents(loggedInUser._id);
        setStudents(students);
        console.log("Students fetched: ", students);
      } catch (error) {
        console.error("Error fetching students: ", error);
      }
    };
    console.log("loggedInUser.students: ", loggedInUser.students);
    fetchInitialStudents();
  }, [loggedInUser]);

  // update filtered students whenever students or searchTerm changes
  useEffect(() => {
    setFilteredStudents(
      students.filter((student) =>
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [students, searchTerm]);

  return (
    <div className={styles.container}>
      <div className={styles.welcomeSection}>
        <div className={styles.welcomeContainer}>
          <h1>Welcome {loggedInUser.fullName}</h1>
          <p>Check out your students profile down below!</p>
          <input
            type="text"
            className={styles.searchBar}
            placeholder="Search for students by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <UserList users={filteredStudents} title={"Students"} />
    </div>
  );
}
