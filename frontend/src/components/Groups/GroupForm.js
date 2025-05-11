import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../../styles/Groups/groupForm.css';
import { login } from '../../routeNames';

const GroupForm = () => {
  const [name, setName] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      alert('No estás autenticado. Por favor, inicia sesión.');
      window.location.href = login;
      return;
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/groups', { name }, {
        headers: { Authorization: token },
      });
      console.log('Grupo creado', response.data);
      alert('Grupo creado con éxito');
      setName('');
    } catch (error) {
      console.error('Error al crear el grupo:', error.response ? error.response.data : error.message);
      alert(error.response?.data?.message || 'Error al crear el grupo');
    }
  };

  return (
    <div className="group-form-container">
      <h2 className="group-form-title">Crear Nuevo Grupo</h2>
      <form onSubmit={handleSubmit} className="group-form">
        <label htmlFor="nombre">Nombre del grupo:</label>
        <input
          type="text"
          id="nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Introduce el nombre del grupo"
        />
        <button type="submit" className="group-submit-btn">Crear Grupo</button>
      </form>
    </div>
  );
};

export default GroupForm;
