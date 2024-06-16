import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
            <li><a href="/">Inicio</a></li>
            <li><a href="/calculator">Calculadora</a></li>
            <li><a href="/list">Mis Proyectos</a></li>
            {!user ? (
              <>
                <li><a href="/register">Registrarse</a></li>
                <li><a href="/login">Iniciar Sesión</a></li>
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
