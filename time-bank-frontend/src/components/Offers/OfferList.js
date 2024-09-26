import React, { useEffect, useState } from 'react';
import api from '../../api';

const OfferList = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await api.get('/offers');
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
            <h2>{offer.titulo}</h2>
            <p>{offer.descripcion}</p>
            <p>Tiempo a intercambiar: {offer.tiempoIntercambio}</p>
            <p>Fecha de publicación: {new Date(offer.fechaPublicacion).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OfferList;
