import styles from './Home.module.css'
import { useAuth } from "../../contexts/AuthContext";
import StudentHome from './StudentHome/StudentHome';
import TutorHome from './TutorHome/TutorHome';


export default function Home() {

	const { user } = useAuth();

	return (
		<div className={styles.container}>
			{user.role === "Student"? <StudentHome /> : <TutorHome />}
		</div>
	)

};