import React, { useEffect, useState } from 'react';
import api from '../../api';
import { login } from '../../routeNames';
import '../../styles/Groups/groupDetails.css';
import { useParams, Link } from 'react-router-dom';


const GroupJoinRequests = () => {
  const [requests, setRequests] = useState([]);
  const { groupId } = useParams();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      alert('No estás autenticado. Por favor, inicia sesión.');
      window.location.href = login;
      return;
    }

    const fetchRequests = async () => {
      try {
        const response = await api.get(`/groups/${groupId}/joinRequests`, {
          headers: { Authorization: token },
        });

        const filtered = response.data.filter(m => m.status === 'Solicitud');
        setRequests(filtered);
      } catch (error) {
        console.error('Error fetching join requests:', error.response.data.message);
      }
    };

    fetchRequests();
  }, [groupId, token]);

  const handleAccept = async (memberId) => {
    try {
      const response = await api.post(`/groups/${memberId}/accept`, {}, {
        headers: { Authorization: token },
      });
      setRequests(prev => prev.filter(req => req.id !== memberId));
      alert(response.data.message);
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleReject = async (memberId) => {
    try {
      await api.delete(`/groups/${memberId}/reject`, {
        headers: { Authorization: token },
      });
      setRequests(prev => prev.filter(req => req.id !== memberId));
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  return (
  <div className="group-requests-container">
    <h1 className="group-requests-title">Solicitudes de Unión</h1>

    {requests.length === 0 ? (
      <div className="group-loading">No hay solicitudes pendientes.</div>
    ) : (
      <ul className="group-requests-list">
        {requests.map((request) => (
          <li key={request.id} className="group-request-item">
            <Link to={`/profile/${request.user.id}`} className="member-link">
                {request.user.name}
            </Link>
            <button onClick={() => handleAccept(request.id)}>Aceptar</button>
            <button onClick={() => handleReject(request.id)}>Rechazar</button>
          </li>
        ))}
      </ul>
    )}
  </div>
);
};

export default GroupJoinRequests;
