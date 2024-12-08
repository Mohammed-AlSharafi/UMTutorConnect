import styles from './Home.module.css'
import SearchBar from "../../components/HomePage/SearchBar";
import UserList from "../../components/HomePage/UserList/UserList";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from 'react';
import { fetchTopTutors } from '../../proxies/tutors';


export default function Home() {

	const { user } = useAuth();
	const [tutors, setTutors] = useState([]);
	const [title, setTitle] = useState("Tutor List");
	// const [subject, setSubject] = useState("");
	// const [isSearching, setIsSearching] = useState(false);

	useEffect(() => {
		const fetchInitialTutors = async() => {
			try {
				const topTutors = await fetchTopTutors();
				setTutors(topTutors);
				setTitle("Top Tutor Listings");
				console.log("Top tutors fetched: ", topTutors);
			} catch (error) {
				console.error("Error fetching top tutors: ", error);
			}
		}
		fetchInitialTutors();
	}, []);


	const handleSearchResults = (searchResults, subject) => {
		console.log("Tutors received in Home: ", searchResults);
		setTutors(searchResults);
		setTitle(`Tutors found: ` + searchResults.length);
		// if (searchResults.length > 0) {
		// 	// setTitle(`Tutors Offering ${subject}`);
		// 	setTitle(`Tutors found: ` + searchResults.length);
		// } else {
		// 	console.log("hehe");
		// 	setTitle(`No Tutors Found for ${subject}`);
		// }
		// if (searchResults.length == 0) {
		// 	setTitle
		// }
	};

	return (
		<div className={styles.container}>
			{user.role === "Student" && <SearchBar />}
			<UserList />
		</div>
	)

};