import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import './Header.css';

export const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [menuActive, setMenuActive] = useState(false);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <header className="header">
      <div className="header-container">
        <h1>Calculadora de Cajones</h1>
        <nav>
          <button className="hamburger" onClick={toggleMenu}>
            ☰
          </button>
          <ul className={menuActive ? 'active' : ''}>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/calculator">Calculadora</Link></li>
            <li><Link to="/list">Mis Proyectos</Link></li>
            {!user ? (
              <>
                <li><Link to="/register">Registrarse</Link></li>
                <li><Link to="/login">Iniciar Sesión</Link></li>
              </>
            ) : (
              <li>
                <button onClick={handleLogout}>Salir</button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
