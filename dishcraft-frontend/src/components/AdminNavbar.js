import { Link } from 'react-router-dom';
import DishCraftLogo from '../image/DishCraftLogo.png'; // ✅ Correct relative path

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
      <Link to="/" style={styles.brandLink}>
        <img 
          src={DishCraftLogo} 
          alt="Dish Craft Logo" 
          style={styles.logoImage} 
        />
        Dish Craft
      </Link>

      <div style={styles.navLinks}>
        <Link to="/recipes" style={styles.navLink}>Recipes</Link>
        <Link to="/groups" style={styles.navLink}>Community Groups</Link>

        {isLoggedIn ? (
          <>
            <Link to="/create-post" style={styles.navLink}>Create Post</Link>
            <Link to="/notifications" style={styles.navLink}>
              <svg xmlns="http://www.w3.org/2000/svg" 
                   style={{ width: "20px", height: "20px" }} 
                   fill="none" viewBox="0 0 24 24" 
                   stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 
                         14.158V11a6.002 6.002 0 00-4-5.659V5a2 
                         2 0 10-4 0v.341C7.67 6.165 6 8.388 6 
                         11v3.159c0 .538-.214 1.055-.595 
                         1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </Link>
            <div style={styles.profileSection}>
              <Link to="/profile" style={styles.navLink}>
                <img 
                  src="https://via.placeholder.com/150" 
                  alt="Profile" 
                  style={styles.profileImage}
                />
              </Link>
            </div>
          </>
        ) : (
          <>
            <Link to="/profile" style={styles.navLink}>Profile</Link>
            {/* <Link to="/register" style={styles.navLink}>Register</Link> */}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;