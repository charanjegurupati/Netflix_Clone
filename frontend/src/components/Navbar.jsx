import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="navbar-logo">Netflix</Link>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/tv-shows">TV Shows</Link>
            <Link to="/movies">Movies</Link>
            <Link to="/my-list">My List</Link>
            {user && user.email === 'charanjegurupati@gmail.com' && (
              <Link to="/admin">Admin</Link>
            )}
            <button onClick={handleLogout} style={{background: 'none', border: 'none', color: 'white', marginLeft: '20px', cursor: 'pointer', fontWeight: 500}}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={{background: 'var(--netflix-red)', padding: '8px 16px', borderRadius: '4px'}}>Sign In</Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
