import { useEffect, useState } from 'react';
import api from '../../api';
import { login } from '../../routeNames';
import '../../styles/Requests/requestForm.css';
import { useParams } from 'react-router-dom';

const GroupRequestForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requestedTime, setRequestedTime] = useState('');
  const token = localStorage.getItem('token');
  const {groupId} = useParams();

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
      const response = await api.post(
        `/groups/${groupId}/requests/new`,
        { title, description, requestedTime },
        { headers: { Authorization: token } }
      );
      alert(response.data.message);
      setTitle('');
      setDescription('');
      setRequestedTime('');
      window.location.href = `/groups/${groupId}/requests`;
    } catch (error) {
      console.error('Error al crear la solicitud:', error.response?.data || error.message);
    }
  };

  return (
    <div className="request-form-container">
      <h1 className="request-form-title">Crear Nueva Solicitud</h1>
      <form className="request-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="requestedTime">Tiempo a Intercambiar (horas):</label>
          <input
            id="requestedTime"
            type="number"
            value={requestedTime}
            onChange={(e) => setRequestedTime(e.target.value)}
            required
          />
        </div>
        <button className="submit-button" type="submit">Crear Solicitud</button>
      </form>
    </div>
  );
};

export default GroupRequestForm;
