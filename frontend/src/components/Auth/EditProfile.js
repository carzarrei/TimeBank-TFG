import React, { useState, useEffect } from 'react';
import api from '../../api';
import {personalProfile } from '../../routeNames.js';
import '../../styles/Auth/register.css';

const EditProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [birth_date, setBirthDate] = useState('');
  const [skills, setSkills] = useState('');

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('userId');
      const response = await api.get(`/users/${id}`, {
        headers: { Authorization: token }
      });
      const userData = response.data;

      // Pre-cargar datos en el formulario
      setName(userData.name || '');
      setEmail(userData.email || '');
      setLocation(userData.location || '');
      setBirthDate(userData.birth_date ? userData.birth_date.slice(0, 10) : '');
      setSkills(userData.skills || '');
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      if (name) formData.append('name', name);
      if (email) formData.append('email', email);
      if (location) formData.append('location', location);
      if (birth_date) formData.append('birth_date', birth_date);
      if (skills) formData.append('skills', skills);

      const response = await api.post('/users/edit-profile', formData, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });

      console.log('Usuario actualizado:', response.data);
      window.location.href = personalProfile;
    } catch (error) {
      console.error('Error al actualizar:', error.response?.data);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h1 className="register-title">Editar Perfil</h1>

      <input
        type="text"
        placeholder="Nombre Completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="register-input"
      />

      <input
        type="email"
        placeholder="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="register-input"
      />

      <input
        type="text"
        placeholder="Ubicación"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="register-input"
      />

      <input
        type="date"
        placeholder="Fecha de Nacimiento"
        value={birth_date}
        onChange={(e) => setBirthDate(e.target.value)}
        className="register-input"
      />

      <input
        type="text"
        placeholder="Habilidades (separadas por comas)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        className="register-input"
      />

      <button type="submit" className="register-button">Guardar Cambios</button>
    </form>
  );
};

export default EditProfile;