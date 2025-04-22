import React, { useEffect, useState } from 'react';
import api from '../../api';
import { login, perfilPersonal } from '../../routeNames.js';
import { calculateAge } from '../../helpers/calculateAge';
import '../../styles/Auth/personalProfile.css';
import UserNotFound from './UserNotFound.js';

const UserProfile = () => {
    const [user, setUser] = useState([]);
    const [userNotFound, setUserNotFound] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('No estás autenticado. Por favor, inicia sesión.');
          window.location.href = login; // Redirigir al login si no hay token
          return;
        }
        const userId = window.location.pathname.split('/').pop();
        if (!(typeof userId !== 'undefined' && userId !== null && userId !== '')) {
          alert('No se ha especificado un usuario.');
          window.location.href = perfilPersonal; // Redirigir alperfil personal si no hay id
          return;
        }
        const fetchUser = async () => {
          try {
            const response = await api.get(`/users/${userId}`, {
              headers: { Authorization: token }
            });
        
            if (!response.data || Object.keys(response.data).length === 0) {
              setUserNotFound(true);
            } else {
              setUser(response.data);
            }
          } catch (error) {
            if (error.response && error.response.status === 404) {
              setUserNotFound(true);
            } else {
              console.error('Error fetching user:', error);
            }
          }
        };
        fetchUser();
    }, []);
    var page;
    if (userNotFound) {
      page=<UserNotFound />;
    } else {
      page= (
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
    
          <div className="profile-actions">
            <button className="btn-contact">Contactar a {user.name}</button>
            <button className="btn-offers">Ver ofertas de {user.name}</button>
          </div>
        </div>
      );
    }
    return page;
    
   };

    export default UserProfile;