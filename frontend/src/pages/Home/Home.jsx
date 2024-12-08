import styles from './Home.module.css'
import SearchBar from "../../components/HomePage/SearchBar";
import UserList from "../../components/HomePage/UserList/UserList";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from 'react';
import { fetchTopTutors } from '../../proxies/tutors';


export default function Home() {

	const { user } = useAuth();
	const [foundUsers, setFoundUsers] = useState([]);
	const [title, setTitle] = useState("Tutor List");
	// const [subject, setSubject] = useState("");
	// const [isSearching, setIsSearching] = useState(false);

	useEffect(() => {
		fetchInitialTutors();
	}, []);

	const fetchInitialTutors = async() => {
		try {
			const topTutors = await fetchTopTutors();
			setFoundUsers(topTutors);
			setTitle("Top Tutor Listings");
			console.log("Top tutors fetched: ", topTutors);
		} catch (error) {
			console.error("Error fetching top tutors: ", error);
		}
	}


	const handleSearchResults = (searchResults, searchQuery) => {

		if(searchQuery === "") {
			setTitle("Tutor List");
			fetchInitialTutors();
			return;
		}

		console.log("Tutors received in Home: ", searchResults);
		setFoundUsers(searchResults);
		setTitle(`Tutors found: ` + searchResults.length);

	};

	return (
		<div className={styles.container}>
			{user.role === "Student" && <SearchBar onSearch={handleSearchResults}/>}
			<UserList users={foundUsers} title={title} />
		</div>
	)

};