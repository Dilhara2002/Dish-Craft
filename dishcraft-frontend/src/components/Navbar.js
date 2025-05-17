import React from 'react';
import { Link } from 'react-router-dom';
import DishCraftLogo from '../image/DishCraftLogo.png';

const Navbar = ({ isLoggedIn = false }) => {
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
    logoImage: {
      width: "32px",
      height: "32px",
      borderRadius: "6px",
      objectFit: "contain"
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
      borderRadius: "6px"
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
    }
  };

  return (
   <nav style={styles.navbar}>
         <Link to="/login" style={styles.brandLink}>
           <img 
             src={DishCraftLogo} 
             alt="Dish Craft Logo" 
             style={styles.logoImage} 
           />
           Dish Craft
         </Link>
      
      <div style={styles.navLinks}>
        
        
        {isLoggedIn ? (
          <>
            <Link to="/add-recipe" style={styles.navLink}>Create Post</Link>
            <div style={styles.profileSection}>
              <Link to="/profile" style={styles.navLink}>Profile</Link>
              <img 
                src="/path/to/default-profile.png" 
                alt="User Profile" 
                style={styles.profileImage} 
              />
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