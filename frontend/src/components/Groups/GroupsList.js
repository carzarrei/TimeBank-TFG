import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Groups/groupsList.css';
import { login } from '../../routeNames';

const GroupsList = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado. Por favor, inicia sesión.');
      window.location.href = login;
      return;
    }

    const fetchGroups = async () => {
      try {
        const response = await api.get('/groups', {
          headers: { Authorization: token },
        });
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="groups-container">
      <h1 className="groups-title">Lista de Grupos</h1>
      <ul className="groups-list">
        {groups.map((group) => (
          <li
            key={group.id}
            className="group-item"
            onClick={() => navigate(`/groups/details/${group.id}`)}
          >
            {group.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupsList;
