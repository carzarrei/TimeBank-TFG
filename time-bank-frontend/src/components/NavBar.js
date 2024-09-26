import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav>
      <Link to="/">Ofertas</Link>
      <Link to="/offers/new">Nueva Oferta</Link>
      <Link to="/requests">Solicitudes</Link>
      <Link to="/requests/new">Nueva Solicitud</Link>
      <Link to="/messages">Mensajes</Link>
      <Link to="/messages/new">Nuevo Mensaje</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </nav>
  );
};

export default NavBar;
