import React, { useState } from 'react';
import styles from './Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import gradHat from '../../images/grad_hat.png';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Header() {
  const location = useLocation();
  const { isAuthenticated, loggedInUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    isAuthenticated() && (
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <a href="/" className={styles.logoBlock}>
            <div className={styles.logo}>
              <img src={gradHat} alt="UMTutorConnect Logo" className={styles.logoImage} />
              <span className={styles.logoText}>UMTutorConnect</span>
            </div>
          </a>
          <button className={styles.menuToggle} onClick={toggleMenu}>
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </button>
          <div className={`${styles.navContainer} ${isMenuOpen ? styles.navOpen : ''}`}>
            <nav className={styles.nav}>
              <Link
                to="/"
                className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to={`/profile/${loggedInUser.role}/${loggedInUser._id}`}
                className={`${styles.navLink} ${location.pathname.startsWith('/profile') ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/communication"
                className={`${styles.navLink} ${location.pathname === '/communication' ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Communication
              </Link>
              <Link
                to="/settings"
                className={`${styles.navLink} ${location.pathname === '/settings' ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </Link>
            </nav>
            {isAuthenticated() && (
              <button className={styles.logoutButton} onClick={logout}>Logout</button>
            )}
          </div>
        </div>
      </header>
    )
  );
}

export default Header;

