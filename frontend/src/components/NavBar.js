import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navBar.css'; // Importa los estilos
import handleLogout from './Auth/Logout';
import {
  listaGrupos,
  listaMensajes,
  listaOfertas,
  listaSolicitudes,
  login,
  nuevaOferta,
  nuevaSolicitud,
  nuevoGrupo,
  nuevoMensaje,
  perfilPersonal,
  register,
} from '../routeNames.js';

const NavBar = () => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token

  return (
    <nav className="navbar">
      
      {!isAuthenticated && (
        <>
          <Link to={login}>Iniciar Sesion</Link>
          <Link to={register}>Registro</Link>
        </>
      )}
      
      {isAuthenticated && (
        <>
        <Link to={listaOfertas}>Ofertas</Link>
        <Link to={nuevaOferta}>Nueva Oferta</Link>
        <Link to={listaSolicitudes}>Solicitudes</Link>
        <Link to={nuevaSolicitud}>Nueva Solicitud</Link>
        <Link to={listaMensajes}>Mensajes</Link>
        <Link to={nuevoMensaje}>Nuevo Mensaje</Link>
        <Link to={nuevoGrupo}>Nuevo Grupo</Link>
        <Link to={listaGrupos}>Grupos</Link>
        <Link to={perfilPersonal}>Mi Perfil</Link>
        <button onClick={handleLogout}>Cerrar Sesion</button>
        </>
      )}
    </nav>
  );
};

export default NavBar;