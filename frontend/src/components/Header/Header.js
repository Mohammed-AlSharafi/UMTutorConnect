import React from 'react';
import styles from './Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import gradHat from '../../images/grad_hat.png';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <a href="/" className={styles.logoBlock}>
        <div className={styles.logo}>
          <img src={gradHat} alt="UMTutorConnect Logo" className={styles.logoImage} />
          <span className={styles.logoText}>UMTutorConnect</span>
        </div>
      </a>
      <nav className={styles.nav}>
        <Link
          to="/"
          className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
        >
          Home
        </Link>
        <Link
          to="/profile"
          className={`${styles.navLink} ${location.pathname === '/profile' ? styles.active : ''}`}
        >
          Profile
        </Link>
        <Link
          to="/communication"
          className={`${styles.navLink} ${location.pathname === '/communication' ? styles.active : ''}`}
        >
          Communication
        </Link>
        <Link
          to="/settings"
          className={`${styles.navLink} ${location.pathname === '/settings' ? styles.active : ''}`}
        >
          Settings
        </Link>
      </nav>
      <div className={styles.search}>
        <input type="text" placeholder="What would you like to learn?" className={styles.searchInput} />
        <button className={styles.searchButton}><FontAwesomeIcon icon={faSearch} /></button>
      </div>
    </header>
  );
}

export default Header;
