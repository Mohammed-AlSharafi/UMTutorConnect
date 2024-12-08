import UserCard from "../UserCard/UserCard";
import styles from "./UserList.module.css";
import { useAuth } from "../../../contexts/AuthContext";

const UserList = ({ users, title }) => {
	const { user } = useAuth();

	return (
		<div className={styles.UserList}>
			<h1 className={styles.title}>{title}</h1>
			<div className={styles.listContainer}>
				{users.map((foundUser, index) => (
					<UserCard
						key={index}
						name={foundUser.fullName}
						subjects={foundUser.subjects}
						rate={foundUser.rate}
						img={foundUser.img}
						role={user.role}
					/>
				))}
			</div>
		</div>
	);
};


export default UserList;