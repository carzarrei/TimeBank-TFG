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

  // Primer useEffect: obtiene el grupo y miembros
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

// Segundo useEffect: espera a que group esté disponible para traer el admin
useEffect(() => {
  if (!group || !group.admin_id) return;

  const fetchGroupAdmin = async () => {
    try {
      const response = await api.get(`/users/${group.admin_id}`, {
        headers: { Authorization: token },
      });
      setGroup((prevGroup) => ({
        ...prevGroup,
        admin_name: response.data.name,
        location: response.data.location,
      }));
    } catch (error) {
      console.error('Error fetching group admin:', error);
    }
  };

  fetchGroupAdmin();
}, [group, token]);


  const joinGroup = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/groups/${groupId}/join`, {}, {
        headers: { Authorization: token },
      });
      window.location.reload();
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const leaveGroup = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/groups/${groupId}/leave`, {}, {
        headers: { Authorization: token },
      });
      window.location.reload();
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const isMember = members.some(member => member.id === userId);

  if (!group) return <div className="group-loading">Cargando grupo...</div>;

  return (
    <div className="group-details-container">
      <h1 className="group-name">{group.name}</h1>

      <div className="group-summary">
        <p><strong>Administrador:</strong> {group.admin_name}</p>
        <p><strong>Número de miembros:</strong> {members.length}</p>
        <p><strong>Localización:</strong> {group.location}</p>
      </div>

      

      <div className="group-actions">
        <div className="group-actions">
          <div className="group-actions-left">
            <Link to={`/groups/${groupId}/members`} className="group-link">👥 Ver miembros del grupo</Link>
            {(group.admin_id === userId) && (
              <Link to={`/groups/${groupId}/joinRequests`} className="requests-btn">📨 Ver Solicitudes de unión</Link>
            )}
          </div>
          <div className="group-actions-right">
            <Link to={`/groups/${groupId}/offers`} className="group-link">Ofertas del grupo</Link>
            <Link to={`/groups/${groupId}/requests`} className="group-link">Solicitudes del grupo</Link>
          </div>
        </div>
        {!isMember && (
          <button onClick={joinGroup} className="join-btn">Solicitar Unirse al grupo</button>
        )}
        {(isMember && group.admin_id !== userId) && (
          <button onClick={leaveGroup} className="leave-btn">Salir del grupo</button>
        )}
        </div>
      </div>
  );
};

export default GroupDetails;
