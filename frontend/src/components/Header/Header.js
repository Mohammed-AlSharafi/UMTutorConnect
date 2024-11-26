import React from 'react';
import styles from './Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import gradHat from '../../images/grad_hat.png';

function Header() {
  return (
    <header className={styles.header}>
      <a href="/" className={styles.logoBlock}>
        <div className={styles.logo}>
          <img src={gradHat} alt="UMTutorConnect Logo" className={styles.logoImage} />
          <span className={styles.logoText}>UMTutorConnect</span>
        </div>
      </a>
      <nav className={styles.nav}>
        <a href="#" className={styles.navLink}>Home</a>
        <a href="#" className={styles.navLink}>Profile</a>
        <a href="#" className={`${styles.navLink} ${styles.active}`}>Messages</a>
        <a href="#" className={styles.navLink}>Settings</a>
      </nav>
      <div className={styles.search}>
        <input type="text" placeholder="What would you like to learn?" className={styles.searchInput} />
        <button className={styles.searchButton}><FontAwesomeIcon icon={faSearch} /></button>
      </div>
    </header>
  );
}

export default Header;

