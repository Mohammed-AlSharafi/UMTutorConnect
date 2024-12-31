import React, { useState, useRef, useEffect } from "react";
import styles from "./SearchBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faSearch,
  faStar,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { fetchTutorsBySubject } from "../../proxies/tutors";

const SearchBar = ({ onSearch, fetchInitialTutors, onFilter, tutors, allTutorsBySubject }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async () => {
    try {
      if (searchQuery === "") {
        fetchInitialTutors();
      } else {
        const tutorsBySubject = await fetchTutorsBySubject(searchQuery);
        console.log("Fetched tutors: ", tutorsBySubject);
        onSearch(tutorsBySubject);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn(`No tutors found for subject: ${searchQuery}`);
        onSearch([]);
      } else {
        console.error("Error fetching tutors:", error);
      }
    }
    setSelectedRatings([]);
    setIsFilterOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleRatingSelect = (rating) => {
    setSelectedRatings(prevRatings =>
      prevRatings.includes(rating)
        ? prevRatings.filter(r => r !== rating)
        : [...prevRatings, rating]
    );
  };

  const handleApplyFilter = () => {
    if (selectedRatings.length === 0) {
      handleSearch();
    } else {
      const filteredTutors = allTutorsBySubject.filter((tutor) => {
        const roundedRating = Math.round(tutor.averageRating);
        return selectedRatings.includes(roundedRating);
      });
      onFilter(filteredTutors);
    }
    setIsFilterOpen(false);
  };

  const handleClearFilter = async () => {
    setSelectedRatings([]);
    onSearch(allTutorsBySubject);
    setIsFilterOpen(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={faStar}
        className={`${styles.star} ${
          index < rating ? styles.selectedStar : ""
        }`}
      />
    ));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Find your Ideal Tutor Today</h1>

      <div className={styles.searchContainer}>
        <input
          className={styles.inputField}
          type="text"
          placeholder='Try "Data Structure and Algorithms"'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className={styles.searchButton} onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
        <div className={styles.filter} ref={filterRef}>
          <button className={styles.filterButton} onClick={handleFilterClick}>
            <FontAwesomeIcon icon={faFilter} />
          </button>
          {isFilterOpen && (
            <div className={styles.ratingDropdown}>
              <button
                className={styles.clearButton}
                onClick={handleClearFilter}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <span className={styles.filterByText}>
                Filter by: <strong>rating</strong>
              </span>
              {[1, 2, 3, 4, 5].map((rating) => (
                <div
                  key={rating}
                  className={styles.ratingOption}
                  onClick={() => handleRatingSelect(rating)}
                >
                  {renderStars(rating)}
                </div>
              ))}
              <button
                className={styles.applyButton}
                onClick={handleApplyFilter}
              >
                Apply Filter
              </button>
            </div>
          )}
        </div>
      </div>
      {selectedRatings.length > 0 && (
        <p className={styles.selectedRatings}>
          Showing tutors with ratings: {selectedRatings.sort().join(", ")} star
          {selectedRatings.length > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

export default SearchBar;

