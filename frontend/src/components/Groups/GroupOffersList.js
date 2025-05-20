import React, { useEffect, useState } from 'react';
import api from '../../api';
import { login } from '../../routeNames';
import { Link, useParams } from 'react-router-dom';
import '../../styles/Requests/requestsList.css';

const GroupOffersList = () => {
  const [offers, setOffers] = useState([]);
  const {groupId} = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado. Por favor, inicia sesión.');
      window.location.href = login;
      return;
    }

    const fetchOffers = async () => {
      try {
        const response = await api.get(`groups/${groupId}/offers`, {
          headers: { Authorization: token },
        });
        setOffers(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="request-list-container">
      <div className="request-list-header">
        <h1>Ofertas Abiertas</h1>
        <div className="request-list-actions">
          <Link to={`/groups/${groupId}/offers/new`} className="btn primary">Crear nueva Oferta</Link>
          <Link to="/requests/filters" className="btn secondary">Filtros avanzados</Link>
        </div>
      </div>

      <div className="request-grid">
        {offers.map((offer) => (
          <Link to={`/offers/details/${offer.id}`} key={offer.id} className="request-card">
            <h3>{offer.title}</h3>
            <p>{offer.description.slice(0, 80)}...</p>
            <p><strong>{offer.offered_time} h</strong></p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GroupOffersList;
