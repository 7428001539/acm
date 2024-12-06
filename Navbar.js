import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <nav className="navbar" ref={menuRef}>
      <Link to="/dashboard" className="title">Sistema de Ciberseguridad</Link>
      <div className={`hamburger-icon ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={`links ${isOpen ? 'open' : ''}`}>
        <Link to="/dashboard">Inicio</Link>
        <Link to="/monitoreo">Monitoreo en Tiempo Real</Link>
        <Link to="/vulnerabilidades">Vulnerabilidades</Link>
        <Link to="/reportes">Reportes</Link>
        <Link to="/usuarios">Usuarios</Link>
        <Link to="/incidentes">Incidentes</Link>
        <Link to="/politicas">Políticas</Link>
        <Link to="/dispositivos">Dispositivos</Link>
        <Link to="/integraciones">Integraciones</Link>
        <Link to="/amenazas">Amenazas</Link>
      </div>
    </nav>
  );
}

export default Navbar;
