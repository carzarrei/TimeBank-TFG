import React, { useEffect, useState } from 'react';
import api from '../../api';

const Profile = () => {
    const [user, setUser] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await api.get('/users/28');
            setUser(response.data);
          } catch (error) {
            console.error('Error fetching offers:', error);
          }
        };

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

    export default Profile;