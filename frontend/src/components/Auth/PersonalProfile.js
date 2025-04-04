import React, { useEffect, useState } from 'react';
import api from '../../api';
const PersonalProfile = () => {
    const [user, setUser] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('No estás autenticado. Por favor, inicia sesión.');
          window.location.href = '/login'; // Redirigir al login si no hay token
          return;
        }
        const fetchUser = async () => {
          try {
            const id = localStorage.getItem('userId');
            const response = await api.get(`/users/${id}`, {
              headers: {
                Authorization: token
              }
            });
            setUser(response.data);
          } catch (error) {
            console.error('Error fetching user:', error);
        };
      }

        fetchUser();
    }, []);

    return (
        <div>
          <h1>Mi perfil</h1>
          <ul>
              <li key={user.id}>
                <h2>{user.nombreCompleto}</h2>
                <p>{user.email}</p>
                <p>{user.localidad}</p>
                <p>{user.fechaNacimiento}</p>
                <p>{user.habilidades}</p>
              </li>
          </ul>
        </div>
      );
    };

    export default PersonalProfile;