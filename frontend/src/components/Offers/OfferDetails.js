import React, { useEffect, useState } from 'react';
import api from '../../api'; // Asegúrate de que la ruta sea correcta
import { Link } from 'react-router-dom';

const OfferDetails= () => {
    const [offer, setOffer] = useState([]);
    const offerId = window.location.pathname.split('/').pop();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId')

    useEffect(() => {
        
        if (!token) {
          alert('No estás autenticado. Por favor, inicia sesión.');
          window.location.href = '/login'; // Redirigir al login si no hay token
          return;
        }

        const fetchOffer = async () => {
          try {
            const response = await api.get('/offers/'+offerId, {
              headers: {
              Authorization: token,
              },
            });
            const creatorResponse = await api.get('/users/'+response.data.creadorId, {
              headers: {
              Authorization: token,
              },
            });
            response.data.creadorNombre = creatorResponse.data.nombreCompleto;
            setOffer(response.data);
          } catch (error) {
            console.error('Error fetching offers:', error);
          }
        };
    
        fetchOffer();
        
      }, [offerId, token]);

      const handleAccept = async () => {
        try {
          const response = await api.post('/offers/'+offerId+'/accept', {}, {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          });
          console.log('Oferta aceptada:', response.data);
          alert('Oferta aceptada con éxito');
          window.location.reload();
        } catch (error) {
          console.error('Error accepting offer:', error);
        }
      }

      const handleComplete = async () => {
        try {
          const response = await api.post('/offers/'+offerId+'/complete', {}, {
            headers: {
              Authorization: token,
            },
          });
          console.log('Oferta completada:', response.data);
          alert('Oferta completada con éxito');
          window.location.reload();
        } catch (error) {
          console.error('Error completing offer:', error);
        }
      }

      return (
        <div>
          <h1>Detalles de la Oferta</h1>
          <ul>
            <li key={offer.id}>
              <h2>{offer.titulo}</h2>
              <Link to={'/profile/'+offer.creadorId}><h3>{offer.creadorNombre}</h3></Link>
              <p>{offer.descripcion}</p>
              <p>Tiempo a intercambiar: {offer.tiempoIntercambio}</p>
              <p>Fecha de publicación: {new Date(offer.fechaPublicacion).toLocaleDateString()}</p>
              <p>Estado: {offer.estado}</p>
              {(offer.aceptadaPor)&&(<p>Aceptada por: {offer.aceptadaPor}</p>)}
            </li>
          </ul>
          {(offer.creadorId!=userId)&&(offer.estado ==='abierta')&&(<button onClick={handleAccept}>Aceptar Oferta</button>)}
          {(offer.aceptadaPor==userId)&&(offer.estado ==='aceptada')&&(<button onClick={handleComplete}>Completar Oferta</button>)}
        </div>
      );
}

export default OfferDetails;
