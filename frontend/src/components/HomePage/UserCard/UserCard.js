import React from "react";
import styles from "./UserCard.module.css";

const UserCard = ({ name, subjects, rate, img, role }) => {
  return (
    <div className={styles.userCard}>
      <h3 className={styles.userName}>{name}</h3>
      {role === "Student" && (
        <>
          <p className={styles.subjects}>{Array.isArray(subjects) ? subjects.join(", ") : "No subjects listed"}</p>
          <h4 className={styles.rate}>{rate} RM/H</h4>
        </>
      )}
    </div>
  );
};

export default UserCard;
