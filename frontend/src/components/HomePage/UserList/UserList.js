import UserCard from "../UserCard/UserCard";
import styles from "./UserList.module.css";
import { Link } from "react-router-dom";

const UserList = ({ users, title }) => {
	return (
		<div className={styles.UserList}>
			<h1 className={styles.title}>{title}</h1>
			<div className={styles.listContainer}>
				{users.map((foundUser, index) => (
					<Link to={`/profile/${foundUser.role}/${foundUser._id}`} className={styles.link} key={index}>
						<UserCard
							key={index}
							name={foundUser.fullName}
							subjects={foundUser.subjects}
							rate={foundUser.rate}
							averageRating={foundUser.averageRating}
							img={foundUser.profilePicture}
							role={foundUser.role}
						/>
					</Link>
				))}
			</div>
		</div>
	);
};


export default UserList;