import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
      <div className="container">
        {/* Brand */}
        <Link to="/recipes" className="navbar-brand d-flex align-items-center">
          <div className="bg-warning rounded-circle p-2 me-2 d-flex align-items-center justify-content-center">
            <span className="fw-bold text-white">DC</span>
          </div>
          <span className="fw-bold text-warning">Dish Craft</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <Link to="/recipes" className="nav-link px-3 fw-medium">
                Recipes
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/myrecipes" className="nav-link px-3 fw-medium">
                My Recipes
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/community-group" className="nav-link px-3 fw-medium">
                Community Groups
              </Link>
            </li>

            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link to="/create-post" className="nav-link px-3 fw-medium">
                    Create Post
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/notifications" className="nav-link px-3 position-relative">
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
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <div className="dropdown">
                    <Link 
                      to="/profile" 
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
                    </Link>
                    <ul className="dropdown-menu dropdown-menu-end shadow-sm mt-2" aria-labelledby="profileDropdown">
                      <li><Link to="/profile" className="dropdown-item">Profile</Link></li>
                      <li><Link to="/settings" className="dropdown-item">Settings</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><Link to="/logout" className="dropdown-item text-danger">Logout</Link></li>
                    </ul>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link px-3 fw-medium">Profile</Link>
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