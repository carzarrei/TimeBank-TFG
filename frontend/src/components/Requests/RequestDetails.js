import React, { useEffect, useState } from 'react';
import api from '../../api'; // Asegúrate de que la ruta sea correcta
import { Link } from 'react-router-dom';
import { login } from '../../routeNames';
import { useParams } from 'react-router-dom';
import '../../styles/Requests/requestDetails.css';

const RequestDetails = () => {
  const [request, setRequest] = useState([]);
  const { requestId } = useParams();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!token) {
      alert('No estás autenticado. Por favor, inicia sesión.');
      window.location.href = login; // Redirigir al login si no hay token
      return;
    }

    const fetchData = async () => {
      try {
        const response = await api.get(`requests/${requestId}`, {
          headers: { Authorization: token },
        });
        setRequest(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchData();
  }, [requestId, token]);

  const handleAccept = async () => {
    try {
      const response = await api.post(`/requests/${requestId}/accept`, {}, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      console.log('Solicitud aceptada:', response.data);
      alert('Solicitud aceptada con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error accepting offer:', error);
    }
  }

  const handleComplete = async () => {
    try {
      const response = await api.post(`/requests/${requestId}/complete`, {}, {
        headers: {
          Authorization: token,
        },
      });
      console.log('Solicitud completada:', response.data);
      alert('Solicitud completada con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error completing offer:', error);
    }
  }

  return (
    <div className="request-details-container">
      <h1 className="request-details-title">Detalles de la Solicitud</h1>
      <ul>
        <li key={request.id} className="request-card">
          <h2>{request.title}</h2>
          {request.creator_id ? (
            <p>
              <strong>Creada por:</strong>{' '}
              <Link to={`/profile/${request.creator_id}`}>Ver perfil del creador</Link>
            </p>
          ) : null}
          {request.group_creator_id ? (
            <p>
              <strong>Creador del grupo:</strong>{' '}
              <Link to={`/groups/${request.group_creator_id}`}>{request.group_creator_id}</Link>
            </p>
          ) : null}
          <p><strong>Descripción:</strong> {request.description}</p>
          <p><strong>Tiempo a intercambiar:</strong> {request.requested_time}</p>
          <p><strong>Fecha de publicación:</strong> {new Date(request.publication_date).toLocaleDateString()}</p>
          <p><strong>Estado:</strong> {request.status}</p>
          {request.accepted_by && <p><strong>Aceptada por:</strong> {request.accepted_by}</p>}
        </li>
      </ul>

      {(request.creator_id !== userId) && (request.status === 'Abierta') && (
      <button className="request-button" onClick={handleAccept}>Aceptar Solicitud</button>
      )}

      {(request.accepted_by == userId) && (request.status === 'Aceptada') && (
        <button className="request-button complete" onClick={handleComplete}>Completar Solicitud</button>
      )}
    </div>
  );
};

export default RequestDetails;
