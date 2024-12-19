import styles from "./StudentHome.module.css";
import SearchBar from "../../../components/HomePage/SearchBar";
import UserList from "../../../components/HomePage/UserList/UserList";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { fetchTopTutors } from "../../../proxies/tutors";

export default function StudentHome() {
  const { user } = useAuth();
  const [tutors, setTutors] = useState([]);
  const [title, setTitle] = useState();
  // const [subject, setSubject] = useState("");
  // const [isSearching, setIsSearching] = useState(false);

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

  const handleSearchResults = (searchResults, searchQuery) => {
    if (searchQuery === "") {
      setTitle("Tutor List");
      fetchInitialTutors();
      return;
    }

    console.log("Tutors received in Home: ", searchResults);
    setTutors(searchResults);
    setTitle(`Tutors found: ` + searchResults.length);
  };

  return (
    <div className={styles.container}>
      <SearchBar onSearch={handleSearchResults} />
      <UserList users={tutors} title={title} />
    </div>
  );
}
