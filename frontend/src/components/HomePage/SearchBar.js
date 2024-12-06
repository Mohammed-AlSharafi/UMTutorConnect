import { useState } from 'react';
import styles from './SearchBar.module.css'
import { fetchTutorsBySubject } from '../../proxies/tutors';

const SearchBar = ({ onSearch }) => {
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = async () => {
		try {
			
			if (!searchQuery.trim()) {
				alert("Please enter a subject to search");
				return;
			}
			const tutors = await fetchTutorsBySubject(searchQuery);
			console.log("Fetched tutors: ", tutors);
			onSearch(tutors, searchQuery);
		} catch (error) {
			// no tutors found for this subject 
			if (error.response && error.response.status === 404){
				console.warn(`No tutors found for subject: ${searchQuery}`);
				onSearch([], searchQuery);
			} else {
				console.error("Error fetching tutors:", error);
			}
		}
	};
	
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Find your Ideal Tutor Today</h1>

			<div className={styles.searchContainer}>
				<input className={styles.inputField}
					type="text"
					placeholder='Try "Data Structure and Algorithms"'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<button className={styles.button} onClick={handleSearch}>
					🔍
				</button>
			</div>
		</div>
	);
};

export default SearchBar;