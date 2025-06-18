import React, { useEffect, useState } from 'react';
import api from '../../api';
import { login } from '../../routeNames';
import '../../styles/Groups/groupDetails.css';
import { useNavigate } from 'react-router-dom';

const UserGroupDetails = () => {
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const token = localStorage.getItem('token');
  const userId = Number(localStorage.getItem('userId'));
  const navigate = useNavigate();

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
      const groupData = userGroup.data;
      setGroup(groupData);
      // redirige con el ID que ya tienes
      navigate(`/groups/${groupData.id}`);
    }
  } catch (error) {
    console.error('Error fetching user group:', error);
  }
};

  fetchUserGroup();
}, [token]);

}

export default UserGroupDetails;
