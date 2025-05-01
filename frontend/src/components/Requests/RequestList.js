import React, { useEffect, useState } from 'react';
import api from '../../api';
import { login } from '../../routeNames';
import '../../styles/Requests/requestsList.css';

const RequestList = () => {
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
        const response = await api.get('/requests', {
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
      <h1 className="request-list-title">Solicitudes Disponibles</h1>
      <ul className="request-list">
        {requests.map((request) => (
          <li className="request-item" key={request.id}>
            <a href={`/requests/details/${request.id}`} className="request-link">
              <h2 className="request-title">{request.title}</h2>
              <p className="request-description">{request.description}</p>
              <p className="request-time">Tiempo a intercambiar: {request.requested_time}</p>
              <p className="request-date">Fecha: {new Date(request.publication_date).toLocaleDateString()}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RequestList;
