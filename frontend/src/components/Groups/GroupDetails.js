import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';
import { login } from '../../routeNames';
import '../../styles/Groups/groupDetails.css';

const GroupDetails = () => {
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const groupId = window.location.pathname.split('/').pop();
  const token = localStorage.getItem('token');
  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    if (!token) {
      alert('No estás autenticado. Por favor, inicia sesión.');
      window.location.href = login;
      return;
    }

    const fetchGroupDetails = async () => {
      try {
        const response = await api.get(`/groups/${groupId}`, {
          headers: { Authorization: token },
        });
        setGroup(response.data);
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
    };

    const fetchGroupMembers = async () => {
      try {
        const response = await api.get(`/groups/${groupId}/members`, {
          headers: { Authorization: token },
        });
        setMembers(response.data);
      } catch (error) {
        console.error('Error fetching group members:', error);
      }
    };

    fetchGroupDetails();
    fetchGroupMembers();
  }, [groupId, token]);

  const joinGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/groups/${groupId}/join`, {}, {
        headers: { Authorization: token },
      });
      console.log(response.data);
      window.location.reload(); // Refrescar para mostrar cambios
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const leaveGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/groups/${groupId}/leave`, {}, {
        headers: { Authorization: token },
      });
      console.log(response.data);
      window.location.reload(); // Refrescar para mostrar cambios
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const isMember = members.some(member => member.id == userId);

  if (!group) return <div className="group-loading">Cargando grupo...</div>;

  return (
    <div className="group-details-container">
      <h1 className="group-name">{group.nombre}</h1>
      
      <h2 className="members-title">Miembros del grupo</h2>
      <ul className="members-list">
        {members.map(member => (
            <li key={member.id} className="member-item">
            <Link to={`/profile/${member.id}`} className="member-link">
                {member.name}
            </Link>
            <span className="member-hours">{member.accumulated_time} horas grupales</span>
            </li>
        ))}
      </ul>

      <div className="group-actions">
        {!isMember && (
          <button onClick={joinGroup} className="join-btn">Solicitar Unirse al grupo</button>
        )}
        {(isMember && group.admin_id !== userId) && (
          <button onClick={leaveGroup} className="leave-btn">Salir del grupo</button>
        )}
        {(group.admin_id == userId) && (
          <Link to={`/groups/${groupId}/joinRequests`} className="requests-btn">Ver Solicitudes de unión</Link>
        )}
        
      </div>
    </div>
  );
};

export default GroupDetails;
