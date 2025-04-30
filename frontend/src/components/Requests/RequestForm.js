import React, { useEffect, useState } from 'react';
import api from '../../api'; // Asegúrate de que la ruta sea correcta
import { login } from '../../routeNames';

const RequestForm = () => {
  // Estado para los campos del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requestedTime, setRequestedTime] = useState('');
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (!token) {
      alert('No estás autenticado. Por favor, inicia sesión.');
      window.location.href = login; // Redirigir al login si no hay token
      return;
    }
  }, [token]);
  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Enviar los datos al backend
      const response = await api.post('/requests', {
        title,
        description,
        requestedTime,
      }, {
        headers: {
          Authorization: token,
        },
      });

      // Manejar la respuesta del backend (por ejemplo, mostrar un mensaje o redirigir)
      console.log('Solicitud creada:', response.data);
      alert('Solicitud creada con éxito');
      // Opcional: Limpiar el formulario
      setTitle('');
      setDescription('');
      setRequestedTime('');
    } catch (error) {
      console.error('Error al crear la solicitud:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h1>Crear Nueva Solicitud</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Título:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="requestedTime">Tiempo a Intercambiar (horas):</label>
          <input
            id="requestedTime"
            type="number"
            value={requestedTime}
            onChange={(e) => setRequestedTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Crear Solicitud</button>
      </form>
    </div>
  );
};

export default RequestForm;
