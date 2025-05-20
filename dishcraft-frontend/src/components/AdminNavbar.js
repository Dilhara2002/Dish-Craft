import { useState } from 'react';

const Navbar = ({ isLoggedIn = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
      <div className="container">
        {/* Brand */}
        <a href="/recipes" className="navbar-brand d-flex align-items-center">
          <div className="bg-warning rounded-circle p-2 me-2 d-flex align-items-center justify-content-center">
            <span className="fw-bold text-white">DC</span>
          </div>
          <span className="fw-bold text-warning">Dish Craft</span>
        </a>


      <div style={styles.navLinks}>
        <Link to="/recipes" style={styles.navLink}>Recipes</Link>
        <Link to="/myrecipes" style={styles.navLink}>My Recipes</Link>
        <Link to="/community-group" style={styles.navLink}>Community Groups</Link>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>


        {/* Navigation Links */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <a href="/recipes" className="nav-link px-3 fw-medium">
                Recipes
              </a>
            </li>
            <li className="nav-item">
              <a href="/myrecipes" className="nav-link px-3 fw-medium">
                My Recipes
              </a>
            </li>
            <li className="nav-item">
              <a href="/community-group" className="nav-link px-3 fw-medium">
                Community Groups
              </a>
            </li>

            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <a href="/create-post" className="nav-link px-3 fw-medium">
                    Create Post
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/notifications" className="nav-link px-3 position-relative">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        width="20" height="20" 
                        fill="currentColor" 
                        viewBox="0 0 16 16" 
                        className="text-secondary">
                      <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
                    </svg>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      3
                      <span className="visually-hidden">unread notifications</span>
                    </span>
                  </a>
                </li>
                <li className="nav-item ms-2">
                  <div className="dropdown">
                    <a 
                      href="/profile" 
                      className="nav-link p-0"
                      role="button"
                      id="profileDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="rounded-circle overflow-hidden border-3 border-warning" style={{ width: "40px", height: "40px" }}>
                        <img 
                          src="/api/placeholder/150/150" 
                          alt="Profile" 
                          className="img-fluid"
                        />
                      </div>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end shadow-sm mt-2" aria-labelledby="profileDropdown">
                      <li><a href="/profile" className="dropdown-item">Profile</a></li>
                      <li><a href="/settings" className="dropdown-item">Settings</a></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><a href="/logout" className="dropdown-item text-danger">Logout</a></li>
                    </ul>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a href="/profile" className="nav-link px-3 fw-medium">Profile</a>
                </li>
                <li className="nav-item">
                  
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;