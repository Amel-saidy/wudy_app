import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="navbar-brand" onClick={closeMenu}>Wudy Tailoring</Link>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--primary-color)' }}
            title="Toggle Dark Mode"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            ☰
          </button>
        </div>

        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/shop" onClick={closeMenu}>Shop</Link>
          <Link to="/custom-order" onClick={closeMenu}>Custom Order</Link>
          <Link to="/measurements" onClick={closeMenu}>Measurements</Link>
          <Link to="/cart" onClick={closeMenu}>Cart</Link>
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin" onClick={closeMenu}>Dashboard</Link>}
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={closeMenu}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
