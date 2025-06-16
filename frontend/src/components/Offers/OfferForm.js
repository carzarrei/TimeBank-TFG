import React, { useEffect, useState } from 'react';
import api from '../../api';
import { login, offersList } from '../../routeNames';
import '../../styles/Offers/offerForm.css';

const OfferForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [offeredTime, setOfferedTime] = useState('');
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
      const response = await api.post(
        '/offers',
        { title, description, offeredTime },
        { headers: { Authorization: token } }
      );
      alert(response.data.message || 'Solicitud creada con éxito');
      setTitle('');
      setDescription('');
      setOfferedTime('');
      window.location.href = offersList;
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
        <button className="submit-button" type="submit">Crear Oferta</button>
      </form>
    </div>
  );
};

export default OfferForm;
