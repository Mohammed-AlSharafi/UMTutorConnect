import UserCard from "../UserCard/UserCard";
import styles from "./UserList.module.css";
import { useAuth } from "../../../contexts/AuthContext";

const UserList = () => {

	const { user } = useAuth();

	const cardsData = [
		{ name: "John Doe", subject: "Data Structures", rate: 20 , img: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
		{ name: "Jane Smith", subject: "Algorithms", rate: 25 , img: "https://plus.unsplash.com/premium_photo-1658506795539-8c3e055c960c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
		{ name: "Chris Lee", subject: "Machine Learning", rate: 30 , img: "https://images.unsplash.com/photo-1495603889488-42d1d66e5523?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},

		// You can add more here
	];

	return (
		<div className={styles.UserList}>

			{user.role === "Student" && <h1 className={styles.title}>Top Tutors</h1>}
			{user.role !== "Student" && <h1 className={styles.title}> My Students</h1>}
			<div className={styles.listContainer}>
				{cardsData.map((data, index) => (
					<UserCard
						key={index}
						name={data.name}
						subject={data.subject}
						rate={data.rate}
						img={data.img}
						role={user.role}
					/>
				))}
			</div>
		</div>
	);
};

export default UserList;