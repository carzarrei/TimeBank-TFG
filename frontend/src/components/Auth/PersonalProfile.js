import React, { useEffect, useState } from 'react';
import api from '../../api';
import { calculateAge } from '../../helpers/calculateAge';
import '../../styles/Auth/personalProfile.css';

const PersonalProfile = () => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado. Por favor, inicia sesión.');
      window.location.href = '/login';
      return;
    }

    const fetchUser = async () => {
      try {
        const id = localStorage.getItem('userId');
        const response = await api.get(`/users/${id}`, {
          headers: { Authorization: token }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);
  console.log(user.profile_picture);

  return (
    <div className="profile-container">
      <h1 className="profile-title">Perfil de Usuario</h1>

      <div className="profile-main">
        <div className="profile-image">
          {/* Aquí puedes poner una imagen real si el usuario tiene foto */}
          <img src={"http://localhost:4000/uploads/profile_pictures/"+user.profile_picture} alt="Foto de perfil" />
        </div>

        <div className="profile-details">
          <p><strong>👤</strong> {user.name}</p>
          <p><strong>📅</strong> {calculateAge(user.birth_date)} años</p>
          <p><strong>📍</strong> {user.location}</p>
        </div>
      </div>

      <div className="profile-skills">
        <p><strong>Habilidades:</strong></p>
        <div className="skills-list">
          {user.skills?.split(',').map((skill, index) => (
            <span key={index} className="skill-item">{skill.trim()}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalProfile;