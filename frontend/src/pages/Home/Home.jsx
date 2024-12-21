import styles from './Home.module.css'
import { useAuth } from "../../contexts/AuthContext";
import StudentHome from './StudentHome/StudentHome';
import TutorHome from './TutorHome/TutorHome';


export default function Home() {

	const { loggedInUser } = useAuth();

	return (
		<div className={styles.container}>
			{loggedInUser.role === "Student"? <StudentHome /> : <TutorHome />}
		</div>
	)

};