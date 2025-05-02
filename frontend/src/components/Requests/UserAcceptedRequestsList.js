import React, { useEffect, useState } from 'react';
import api from '../../api';
import { login } from '../../routeNames';
import { Link } from 'react-router-dom';
import '../../styles/Requests/requestsList.css';

const UserAcceptedRequestsList = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado. Por favor, inicia sesión.');
      window.location.href = login;
      return;
    }

    const fetchRequests = async () => {
      try {
        const response = await api.get('/requests/my-requests/accepted', {
          headers: { Authorization: token },
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="request-list-container">
      <div className="request-list-header">
        <h1>Tus Solicitudes Aceptadas</h1>
        <div className="request-list-actions">
          <Link to="/requests/new" className="btn primary">Crear nueva solicitud</Link>
          <Link to="/requests/filters" className="btn secondary">Filtros avanzados</Link>
        </div>
      </div>

      <div className="request-grid">
        {requests.map((request) => (
          <Link to={`/requests/details/${request.id}`} key={request.id} className="request-card">
            <h3>{request.title}</h3>
            <p>{request.description.slice(0, 80)}...</p>
            <p><strong>{request.requested_time} h</strong></p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserAcceptedRequestsList;
