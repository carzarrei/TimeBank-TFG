// src/components/Groups/GroupMembersView.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import '../../styles/Groups/groupDetails.css';

const GroupMembers = () => {
  const { groupId } = useParams();
  const token = localStorage.getItem('token');
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState('');

  if (!token) {
    alert('No estás autenticado. Por favor, inicia sesión.');
    window.location.href = '/login';
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupRes = await api.get(`/groups/${groupId}`, {
          headers: { Authorization: token }
        });
        setGroupName(groupRes.data.name);

        const membersRes = await api.get(`/groups/${groupId}/members`, {
          headers: { Authorization: token }
        });
        setMembers(membersRes.data);
      } catch (err) {
        console.error('Error fetching group members:', err);
      }
    };

    fetchData();
  }, [groupId, token]);

  return (
    <div className="group-details-container">
      <h1 className="group-name">Miembros de "{groupName}"</h1>
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
      <Link to={`/groups/${groupId}`} className="group-link">← Volver a detalles del grupo</Link>
    </div>
  );
};

export default GroupMembers;
