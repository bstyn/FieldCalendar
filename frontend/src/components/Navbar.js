import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Rezerwacja Boisk
        </Link>
        <ul className="navbar-nav">
          <li>
            <Link to="/">Strona Główna</Link>
          </li>
          {user ? (
            <>
              {user.role === 'admin' && (
                <li>
                  <Link to="/admin">Panel Administratora</Link>
                </li>
              )}
              <li>
                <span style={{ color: 'white', padding: '8px 15px' }}>
                  {user.email}
                </span>
              </li>
              <li>
                <button 
                  onClick={logout} 
                  className="button button-secondary"
                  style={{ padding: '8px 15px' }}
                >
                  Wyloguj
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Zaloguj</Link>
              </li>
              <li>
                <Link to="/register">Zarejestruj</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
