import styles from './Home.module.css'
import SearchBar from "../../components/HomePage/SearchBar";
import UserList from "../../components/HomePage/UserList/UserList";
import { useAuth } from "../../contexts/AuthContext";


export default function Home() {

	const { user } = useAuth();

	return (
		<div className={styles.container}>
			{user.role === "Student" && <SearchBar />}
			<UserList />
		</div>
	)

};