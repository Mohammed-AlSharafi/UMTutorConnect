import React from "react";
import styles from "./UserCard.module.css";

const UserCard = ({ name, subjects, rate, averageRating, img, role }) => {
  return (
    <div className={styles.userCard}>
      <h3 className={styles.userName}>{name}</h3>
      {role === "Tutor" && (
        <>
          <div className={styles.subjects}>
            {Array.isArray(subjects) && subjects.length > 0 ? (
              subjects.map((subject, index) => (
                <span key={index} className={styles.subjectPill}>
                  {subject}
                </span>
              ))
            ) : (
              <span>No subjects listed</span>
            )}
          </div>
          <h4 className={styles.rate}>{rate} RM/H</h4>
        </>
      )}
    </div>
  );
};


export default UserCard;
