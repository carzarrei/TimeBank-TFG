import React, { useState, useEffect, useRef } from 'react';
import '../styles/navBar.css';
import handleLogout from './Auth/Logout';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
          <li onClick={() => navigate(login)}>Iniciar Sesión</li>
          <li onClick={() => navigate(register)}>Registro</li>
        </>
      )}

      {isAuthenticated && (
        <>
          <div className="navbar-left">
            <div className="dropdown-wrapper">
              <button className="navbar-item" onClick={() => toggleMenu('ofertas')}>Ofertas</button>
              {openMenu === 'ofertas' && (
                <ul className="dropdown">
                  <li onClick={() => navigate(listaOfertas)}>Ver Ofertas</li>
                  <li onClick={() => navigate(nuevaOferta)}>Nueva Oferta</li>
                </ul>
              )}
            </div>

            <div className="dropdown-wrapper">
              <button className="navbar-item" onClick={() => toggleMenu('solicitudes')}>Solicitudes</button>
              {openMenu === 'solicitudes' && (
                <ul className="dropdown">
                  <li onClick={() => navigate(newRequest)}>Nueva Solicitud</li>
                  <li onClick={() => navigate(requestsList)}>Ver Solicitudes Abiertas</li>
                  <li onClick={() => navigate(myRequests)}>Mis Solicitudes</li>
                  <li onClick={() => navigate(myAcceptedRequests)}>Mis Solicitudes Aceptadas</li>
                </ul>
              )}
            </div>

            <div className="dropdown-wrapper">
              <button className="navbar-item" onClick={() => toggleMenu('mensajes')}>Mensajes</button>
              {openMenu === 'mensajes' && (
                <ul className="dropdown">
                  <li onClick={() => navigate(listaMensajes)}>Ver Mensajes</li>
                  <li onClick={() => navigate(nuevoMensaje)}>Nuevo Mensaje</li>
                </ul>
              )}
            </div>

            <div className="dropdown-wrapper">
              <button className="navbar-item" onClick={() => toggleMenu('grupos')}>Grupos</button>
              {openMenu === 'grupos' && (
                <ul className="dropdown">
                  <li onClick={() => navigate(listaGrupos)}>Ver Grupos</li>
                  <li onClick={() => navigate(nuevoGrupo)}>Nuevo Grupo</li>
                </ul>
              )}
            </div>
          </div>

          <div className="navbar-right">
            <div className="dropdown-wrapper">
              <button className="navbar-item" onClick={() => toggleMenu('perfil')}>Perfil</button>
              {openMenu === 'perfil' && (
                <ul className="dropdown dropdown-right">
                  <li onClick={() => navigate(personalProfile)}>Mi Perfil</li>
                  <li onClick={handleLogout} className="logout-item">Cerrar Sesión</li>
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