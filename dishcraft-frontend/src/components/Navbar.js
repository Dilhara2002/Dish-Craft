import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DishCraftLogo from '../image/DishCraftLogo.png';

const Navbar = ({ isLoggedIn = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const styles = {
    navbar: {
      backgroundColor: "#ffffff",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      padding: "16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "sticky",
      top: 0,
      zIndex: 50
    },
    brandLink: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#f59e0b",
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    logoContainer: {
      backgroundColor: "#f59e0b",
      borderRadius: "50%",
      padding: "8px",
      marginRight: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
      width: "32px",
      height: "32px"
    },
    navLinks: {
      display: "flex",
      gap: "24px",
      alignItems: "center"
    },
    navLink: {
      color: "#4b5563",
      textDecoration: "none",
      fontWeight: "500",
      fontSize: "15px",
      transition: "all 0.2s ease-in-out",
      padding: "8px 12px",
      borderRadius: "6px",
      '&:hover': {
        color: "#f59e0b"
      }
    },
    profileSection: {
      display: "flex",
      alignItems: "center",
      gap: "16px"
    },
    profileImage: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid #f59e0b"
    },
    notificationIcon: {
      position: "relative",
      color: "#6b7280"
    },
    notificationBadge: {
      position: "absolute",
      top: "-5px",
      right: "-5px",
      backgroundColor: "#ef4444",
      color: "white",
      borderRadius: "50%",
      width: "16px",
      height: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "10px"
    }
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/login" style={styles.brandLink}>
        <div style={styles.logoContainer}>
          DC
        </div>
        Dish Craft
      </Link>

      <div style={styles.navLinks}>
        

        {isLoggedIn ? (
          <>
            <Link to="/create-post" style={styles.navLink}>Create Post</Link>
            <Link to="/notifications" style={styles.notificationIcon}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                fill="currentColor" 
                viewBox="0 0 16 16"
              >
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
              </svg>
              <span style={styles.notificationBadge}>3</span>
            </Link>
            <div style={styles.profileSection}>
              <div style={{ position: "relative" }}>
                <Link to="/profile">
                  <img 
                    src="/path/to/default-profile.png" 
                    alt="User Profile" 
                    style={styles.profileImage} 
                  />
                </Link>
                {/* Dropdown menu would go here */}
              </div>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.navLink}>Login</Link>
            <Link to="/register" style={styles.navLink}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;