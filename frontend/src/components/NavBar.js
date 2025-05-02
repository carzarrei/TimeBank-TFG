import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/navBar.css';
import handleLogout from './Auth/Logout';
import {
  listaGrupos,
  listaMensajes,
  listaOfertas,
  requestsList,
  myRequests,
  myAcceptedRequests,
  login,
  nuevaOferta,
  newRequest,
  nuevoGrupo,
  nuevoMensaje,
  personalProfile,
  register,
} from '../routeNames.js';

const NavBar = () => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar" ref={navRef}>
      {!isAuthenticated && (
        <>
          <Link to={login}>Iniciar Sesión</Link>
          <Link to={register}>Registro</Link>
        </>
      )}

      {isAuthenticated && (
        <>
          <div className="navbar-left">
            <div className="dropdown-wrapper">
              <button className="navbar-item" onClick={() => toggleMenu('ofertas')}>Ofertas</button>
              {openMenu === 'ofertas' && (
                <ul className="dropdown">
                  <li><Link to={listaOfertas}>Ver Ofertas</Link></li>
                  <li><Link to={nuevaOferta}>Nueva Oferta</Link></li>
                </ul>
              )}
            </div>

            <div className="dropdown-wrapper">
              <button className="navbar-item" onClick={() => toggleMenu('solicitudes')}>Solicitudes</button>
              {openMenu === 'solicitudes' && (
                <ul className="dropdown">
                  <li><Link to={newRequest}>Nueva Solicitud</Link></li>
                  <li><Link to={requestsList}>Ver Solicitudes Abiertas</Link></li>
                  <li><Link to={myRequests}>Mis Solicitudes</Link></li>
                  <li><Link to={myAcceptedRequests}>Mis Solicitudes Aceptadas</Link></li>
                </ul>
              )}
            </div>

            <div className="dropdown-wrapper">
              <button className="navbar-item" onClick={() => toggleMenu('mensajes')}>Mensajes</button>
              {openMenu === 'mensajes' && (
                <ul className="dropdown">
                  <li><Link to={listaMensajes}>Ver Mensajes</Link></li>
                  <li><Link to={nuevoMensaje}>Nuevo Mensaje</Link></li>
                </ul>
              )}
            </div>

            <div className="dropdown-wrapper">
              <button className="navbar-item" onClick={() => toggleMenu('grupos')}>Grupos</button>
              {openMenu === 'grupos' && (
                <ul className="dropdown">
                  <li><Link to={listaGrupos}>Ver Grupos</Link></li>
                  <li><Link to={nuevoGrupo}>Nuevo Grupo</Link></li>
                </ul>
              )}
            </div>
          </div>

          <div className="navbar-right">
            <div className="dropdown-wrapper">
              <button className="navbar-item" onClick={() => toggleMenu('perfil')}>Perfil</button>
              {openMenu === 'perfil' && (
                <ul className="dropdown">
                  <li><Link to={personalProfile}>Mi Perfil</Link></li>
                  <li><button onClick={handleLogout}>Cerrar Sesión</button></li>
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default NavBar;
