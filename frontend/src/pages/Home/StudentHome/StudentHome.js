import styles from "./StudentHome.module.css";
import SearchBar from "../../../components/HomePage/SearchBar";
import UserList from "../../../components/HomePage/UserList/UserList";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { fetchTopTutors } from "../../../proxies/tutors";

export default function StudentHome() {
  const { loggedInUser } = useAuth();
  const [tutors, setTutors] = useState([]);
  const [allTutorsBySubject, setAllTutorsBySubject] = useState([]);
  const [title, setTitle] = useState();

  useEffect(() => {
    fetchInitialTutors();
  }, []);

  const fetchInitialTutors = async () => {
    try {
      const topTutors = await fetchTopTutors();
      setTutors(topTutors);
      setTitle("Top Tutor Listings");
      console.log("Top tutors fetched: ", topTutors);
    } catch (error) {
      console.error("Error fetching top tutors: ", error);
    }
  };

  const handleSearchResults = (searchResults) => {
    console.log("Tutors received in Home: ", searchResults);
    setAllTutorsBySubject(searchResults);
    setTutors(searchResults);
    setTitle(`Tutors found: ` + searchResults.length);
  };

  const handleFilterResults = (filterResults) => {
    console.log("Filtered tutors received in Home: ", filterResults);
    setTutors(filterResults)
    setTitle(`Tutors found: ` + filterResults.length);
  }

  return (
    <div className={styles.container}>
      <SearchBar 
      onSearch={handleSearchResults} 
      fetchInitialTutors={fetchInitialTutors}
      onFilter={handleFilterResults}
      tutors={tutors}
      allTutorsBySubject={allTutorsBySubject}/>
      <UserList users={tutors} title={title} />
    </div>
  );
}
