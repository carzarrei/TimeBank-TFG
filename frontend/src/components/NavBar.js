import React, { useState, useEffect, useRef } from 'react';
import '../styles/navBar.css';
import handleLogout from './Auth/Logout';
import { useNavigate, useParams } from 'react-router-dom';
import {
  offersList,
  requestsList,
  myRequests,
  myAcceptedRequests,
  login,
  newRequest,
  nuevoMensaje,
  personalProfile,
  register,
  newOffer,
  myOffers,
  myAcceptedOffers,
  listaMensajes,
  newGroup,
  groupsList,
  userGroupDetails,
} from '../routeNames.js';
import api from '../api';

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);
  const userId = localStorage.getItem('userId');
  const [userGroup, setUserGroup] = useState(null);

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
        <div className="navbar-center">
          <li onClick={() => navigate(login)}>Iniciar Sesión</li>
          <li onClick={() => navigate(register)}>Registro</li>
        </div>
      )}

      {isAuthenticated && (
        <>
          <div className="navbar-left">
            <div className="dropdown-wrapper">
              <button className="navbar-item" onClick={() => toggleMenu('ofertas')}>Ofertas</button>
              {openMenu === 'ofertas' && (
                <ul className="dropdown">
                  <li onClick={() => navigate(offersList)}>Ver Ofertas</li>
                  <li onClick={() => navigate(newOffer)}>Nueva Oferta</li>
                  <li onClick={() => navigate(myOffers)}>Mis Ofertas</li>
                  <li onClick={() => navigate(myAcceptedOffers)}>Mis Ofertas Aceptadas</li>
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
                  <li onClick={() => navigate(userGroupDetails)}>Mi grupo</li>
                  <li onClick={() => navigate(groupsList)}>Ver Grupos</li>
                  <li onClick={() => navigate(newGroup)}>Nuevo Grupo</li>
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