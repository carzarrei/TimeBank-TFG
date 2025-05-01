import React, { useEffect, useState } from 'react';
import api from '../../api';
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
      window.location.href = login;
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
        headers: { Authorization: token },
      });
      alert('Solicitud aceptada con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await api.post(`/requests/${requestId}/confirm`, {}, {
        headers: { Authorization: token },
      });
      alert('Solicitud confirmada con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error confirming request:', error);
    }
  };

  const handleComplete = async () => {
    try {
      const response = await api.post(`/requests/${requestId}/complete`, {}, {
        headers: { Authorization: token },
      });
      alert('Solicitud completada con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error completing request:', error);
    }
  };

  const handleReopen = async () => {
    try {
      const response = await api.post(`/requests/${requestId}/reopen`, {}, {
        headers: { Authorization: token },
      });
      alert('Solicitud reabierta con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error reopening request:', error);
    }
  };

  return (
    <div className="request-details-container">
      <div className="status-bar">
        <span className={`status ${request.status?.toLowerCase()}`}>{request.status}</span>
      </div>

      <h1 className="request-title">{request.title}</h1>

      <div className="request-body">
        <div className="description-box">
          <p><strong>Descripción:</strong></p>
          <p>{request.description}</p>
        </div>

        <div className="creator-box">
          <p><strong>Creador:</strong></p>
          {request.creator_id && (
            <p><Link to={`/profile/${request.creator_id}`}>Ver perfil del creador</Link></p>
          )}
          {request.group_creator_id && (
            <p><Link to={`/groups/${request.group_creator_id}`}>Ver grupo creador</Link></p>
          )}
          <p><strong>Tiempo solicitado:</strong> {request.requested_time}</p>
          <p><strong>Publicado:</strong> {new Date(request.publication_date).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="button-group">
        {/* Botón para aceptar */}
        {(request.creator_id !== Number(userId) && request.status === 'Abierta') && (
          <button className="btn btn-blue" onClick={handleAccept}>Aceptar solicitud</button>
        )}

        {/* Botón para confirmar */}
        {(request.creator_id === Number(userId) && request.status === 'Aceptada') && (
          <button className="btn btn-lightblue" onClick={handleConfirm}>Confirmar solicitud</button>
        )}

        {/* Botón para completar */}
        {(request.accepted_by === Number(userId) && request.status === 'Confirmada') && (
          <button className="btn btn-green" onClick={handleComplete}>Completar solicitud</button>
        )}
      </div>

      {/* Botón para reabrir */}
      {(request.creator_id === Number(userId) && request.status === 'Cerrada') && (
        <button className="btn btn-orange" onClick={handleReopen}>Reabrir solicitud</button>
      )}

      {/* {(request.status === 'Abierta') && (
        <button className="btn btn-yellow">Enviar negociación</button>
      )} */}
    </div>
  );
};

export default RequestDetails;
