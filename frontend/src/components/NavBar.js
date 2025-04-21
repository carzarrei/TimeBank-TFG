import React from 'react';
import { Link } from 'react-router-dom';
import handleLogout from './Auth/Logout';
import {listaGrupos, listaMensajes, listaOfertas, listaSolicitudes, login, nuevaOferta, nuevaSolicitud, nuevoGrupo, nuevoMensaje, perfilPersonal, register, } from '../routeNames.js';

const NavBar = () => {
  return (
    <nav>
      <Link to={listaOfertas}>Ofertas</Link>
      &nbsp;
      <Link to={nuevaOferta}>Nueva Oferta</Link>
      &nbsp;
      <Link to={listaSolicitudes}>Solicitudes</Link>
      &nbsp;
      <Link to={nuevaSolicitud}>Nueva Solicitud</Link>
      &nbsp;
      <Link to={listaMensajes}>Mensajes</Link>
      &nbsp;
      <Link to={nuevoMensaje}>Nuevo Mensaje</Link>
      &nbsp;
      <Link to={nuevoGrupo}>Nuevo Grupo</Link>
      &nbsp;
      <Link to={listaGrupos}>Grupos</Link>
      &nbsp;
      <Link to={login}>Login</Link>
      &nbsp;
      <Link to={register}>Register</Link>
      &nbsp;
      <Link to={perfilPersonal}>Mi Perfil</Link>
      &nbsp;
    
      <button onClick={() => {
        handleLogout();
      }}> Logout </button> 
    </nav>
  );
};

export default NavBar;
