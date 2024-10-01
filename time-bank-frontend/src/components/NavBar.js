import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav>
      <Link to="/">Ofertas</Link>
      &nbsp;
      <Link to="/offers/new">Nueva Oferta</Link>
      &nbsp;
      <Link to="/requests">Solicitudes</Link>
      &nbsp;
      <Link to="/requests/new">Nueva Solicitud</Link>
      &nbsp;
      <Link to="/messages">Mensajes</Link>
      &nbsp;
      <Link to="/messages/new">Nuevo Mensaje</Link>
      &nbsp;
      <Link to="/login">Login</Link>
      &nbsp;
      <Link to="/register">Register</Link>
      &nbsp;
      <Link to="/profile">Perfil</Link>
      &nbsp;
    </nav>
  );
};

export default NavBar;
