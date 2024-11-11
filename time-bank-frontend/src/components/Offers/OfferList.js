import React, { useEffect, useState } from 'react';
import api from '../../api';

const OfferList = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado. Por favor, inicia sesión.');
      window.location.href = '/login'; // Redirigir al login si no hay token
      return;
    }
    const fetchOffers = async () => {
      try {
        const response = await api.get('/offers', {
          headers: {
            Authorization: token,
          },
        });
        setOffers(response.data);
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div>
      <h1>Ofertas</h1>
      <ul>
        {offers.map((offer) => (
          <li key={offer.id}>
            <a href={`/offers/details/${offer.id}`}>
              <h2>{offer.titulo}</h2>
              <p>{offer.descripcion}</p>
              <p>Tiempo a intercambiar: {offer.tiempoIntercambio}</p>
              <p>Fecha de publicación: {new Date(offer.fechaPublicacion).toLocaleDateString()}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OfferList;
