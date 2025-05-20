import { useEffect, useState } from 'react';
import api from '../../api';
import { login } from '../../routeNames';
import '../../styles/Requests/requestForm.css';
import { useParams } from 'react-router-dom';

const GroupOfferForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [offeredTime, setOfferedTime] = useState('');
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
        `/groups/${groupId}/offers/new`,
        { title, description, offeredTime },
        { headers: { Authorization: token } }
      );
      alert(response.data.message);
      setTitle('');
      setDescription('');
      setOfferedTime('');
      window.location.href = `/groups/${groupId}/offers`;
    } catch (error) {
      console.error('Error al crear la oferta:', error.response?.data || error.message);
    }
  };

  return (
    <div className="offer-form-container">
      <h1 className="offer-form-title">Crear Nueva Oferta</h1>
      <form className="offer-form" onSubmit={handleSubmit}>
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
          <label htmlFor="offeredTime">Tiempo a Intercambiar (horas):</label>
          <input
            id="offeredTime"
            type="number"
            value={offeredTime}
            onChange={(e) => setOfferedTime(e.target.value)}
            required
          />
        </div>
        <button className="submit-button" type="submit">Crear Solicitud</button>
      </form>
    </div>
  );
};

export default GroupOfferForm;
