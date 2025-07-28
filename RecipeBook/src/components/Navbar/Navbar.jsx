import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Adjust the path as needed
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 525) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            RecipeBook
          </Link>
          <div className="navbar-links desktop-menu">
            <Link to="/" className="navbar-link">Home</Link>
            <Link to="/recipes" className="navbar-link">Recipes</Link>
            <Link to="/saved" className="navbar-link">Saved Recipes</Link>
            {user ? (
              <button className="navbar-button logout" onClick={logout}>
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="navbar-button login">
                  Login
                </Link>
                <Link to="/register" className="navbar-button register">
                  Register
                </Link>
              </>
            )}
          </div>
          
          {/* Hamburger Menu Button */}
          <button 
            className={`hamburger ${isMenuOpen ? 'hamburger-open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="mobile-menu-content">
          <Link to="/" className="mobile-menu-link" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/recipes" className="mobile-menu-link" onClick={closeMenu}>
            Recipes
          </Link>
          <Link to="/saved" className="mobile-menu-link" onClick={closeMenu}>
            Saved Recipes
          </Link>
          {user ? (
            <button 
              className="mobile-menu-link mobile-menu-button logout" 
              onClick={() => {
                logout();
                closeMenu();
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="mobile-menu-link mobile-menu-button login" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="mobile-menu-link mobile-menu-button register" onClick={closeMenu}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;