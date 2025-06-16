import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';
import { login } from '../../routeNames';
import '../../styles/Groups/groupDetails.css';

const UserGroupDetails = () => {
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const token = localStorage.getItem('token');
  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    if (!token) {
      alert('No estás autenticado. Por favor, inicia sesión.');
      window.location.href = login;
      return;
    }

    const fetchUserGroup = async () => {
      try {
        const userGroup = await api.get(`/groups/user/group`, {
          headers: { Authorization: token },
        });
        if (userGroup.data) {
          setGroup(userGroup.data);
        }
        window.location.href = `/groups/${group.id}`;
      } catch (error) {
        console.error('Error fetching user group:', error);
      }
    };  
    fetchUserGroup();
  }, [group, token]);

}

export default UserGroupDetails;
