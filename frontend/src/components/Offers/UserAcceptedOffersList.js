import React, { useEffect, useState } from 'react';
import api from '../../api';
import { login } from '../../routeNames';
import { Link } from 'react-router-dom';
import '../../styles/Offers/offersList.css';

const UserAcceptedOffersList = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado. Por favor, inicia sesión.');
      window.location.href = login;
      return;
    }

    const fetchOffers = async () => {
      try {
        const response = await api.get('/offers/my-offers/accepted', {
          headers: { Authorization: token },
        });
        setOffers(response.data);
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="offer-list-container">
      <div className="offer-list-header">
        <h1>Tus Ofertas Aceptadas</h1>
        <div className="offer-list-actions">
          <Link to="/offers/new" className="btn primary">Crear nueva oferta</Link>
          <Link to="/offers/filters" className="btn secondary">Filtros avanzados</Link>
        </div>
      </div>

      <div className="offer-grid">
        {offers.map((offer) => (
          <Link to={`/offers/details/${offer.id}`} key={offer.id} className="offer-card">
            <h3>{offer.title}</h3>
            <p>{offer.description.slice(0, 80)}...</p>
            <p><strong>{offer.offered_time} h</strong></p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserAcceptedOffersList;
