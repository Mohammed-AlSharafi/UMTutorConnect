import React from "react";
import styles from "./UserCard.module.css";

const UserCard = ({ name, subject, rate, img, role }) => {
  return (
    <div className={styles.userCard}>
      <img className={styles.image} src={img} alt="Tutor Image" />
      <h3>{name}</h3>
      {role === "Student" && (
        <>
          <p>{subject}</p>
          <h4 className={styles.rate}>{rate} RM/H</h4>
        </>
      )}
    </div>
  );
};

export default UserCard;
