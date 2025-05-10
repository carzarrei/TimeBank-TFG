import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';
import { login } from '../../routeNames';
import { useParams } from 'react-router-dom';
import '../../styles/Offers/offerDetails.css';

const OfferDetails = () => {
  const [offer, setOffer] = useState([]);
  const { offerId } = useParams();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!token) {
      alert('No estás autenticado. Por favor, inicia sesión.');
      window.location.href = login;
      return;
    }
  
    const fetchData = async () => {
      try {
        const response = await api.get(`/offers/${offerId}`, {
          headers: { Authorization: token },
        });
  
        const offerData = response.data;
        setOffer(offerData);
  
        // Una vez que tenemos el offerData, usamos su creator_id
        const userResponse = await api.get(`users/username/${offerData.creator_id}`, {
          headers: { Authorization: token },
        });
  
        setOffer((prevOffer) => ({
          ...prevOffer,
          creator_username: userResponse.data,
        }));
      } catch (error) {
        console.error('Error al cargar la oferta o el usuario:', error);
      }
    };
  
    fetchData();
  }, [offerId, token]);

  const handleAccept = async () => {
    try {
      const response = await api.post(`/offers/${offerId}/accept`, {}, {
        headers: { Authorization: token },
      });
      alert('Oferta aceptada con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error accepting offer:', error);
    }
  };

  const handleCancel = async () => {
    try {
      const response = await api.post(`/offers/${offerId}/cancel`, {}, {
        headers: { Authorization: token },
      });
      alert('Oferta cancelada con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error canceling offer:', error.response.data.message);
    }
  }

  const handleConfirm = async () => {
    try {
      const response = await api.post(`/offers/${offerId}/confirm`, {}, {
        headers: { Authorization: token },
      });
      alert('Oferta confirmada con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error confirming offer:', error);
    }
  };

  const handleConfirmCancelation = async () => {
    try {
      const response = await api.post(`/offers/${offerId}/confirm-cancelation`, {}, {
        headers: { Authorization: token },
      });     
      alert('Cancelación confirmada con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error confirming cancelation:', error);
    }
  };

  const handleComplete = async () => {
    try {
      const response = await api.post(`/offers/${offerId}/complete`, {}, {
        headers: { Authorization: token },
      });
      alert('Oferta completada con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error completing offer:', error);
    }
  };

  const handleReopen = async () => {
    try {
      const response = await api.post(`/offers/${offerId}/reopen`, {}, {
        headers: { Authorization: token },
      });
      alert('Oferta reabierta con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error reopening offer:', error);
    }
  };

  return (
    <div className="offer-details-container">
      <div className="status-bar">
        <span className={`status ${offer.status?.toLowerCase()}`}>{offer.status}</span>
      </div>

      <h1 className="offer-title">{offer.title}</h1>

      <div className="offer-body">
        <div className="description-box">
          <p><strong>Descripción:</strong></p>
          <p>{offer.description}</p>
        </div>

        <div className="creator-box">
          <p><strong>Creador:</strong></p>
          {offer.creator_id && (
            <p><Link to={`/profile/${offer.creator_id}`}>{offer.creator_username}</Link></p>
          )}
          {offer.group_creator_id && (
            <p><Link to={`/groups/${offer.group_creator_id}`}>Ver grupo creador</Link></p>
          )}
          <p><strong>Tiempo ofertado:</strong> {offer.offered_time}</p>
          <p><strong>Publicado:</strong> {new Date(offer.publication_date).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="button-group">
        {/* Botón para aceptar */}
        {(offer.creator_id !== Number(userId) && offer.status === 'Abierta') && (
          <button className="btn btn-blue" onClick={handleAccept}>Aceptar oferta</button>
        )}

        {/* Botón para cancelar */}
        {(offer.creator_id === Number(userId) && offer.status === 'Aceptada') && (
          <button className="btn btn-red" onClick={handleCancel}>Cancelar oferta</button>
        )}

        {/* Botón para confirmar cancelación */}
        {(offer.accepted_by === Number(userId) && offer.status === 'Cancelada') && (
          <button className="btn btn-red" onClick={handleConfirmCancelation}>Confirmar cancelación</button>
        )}

        {/* Botón para confirmar */}
        {(offer.accepted_by === Number(userId) && offer.status === 'Aceptada') && (
          <button className="btn btn-lightblue" onClick={handleConfirm}>Confirmar oferta</button>
        )}

        {/* Botón para completar */}
        {(offer.creator_id === Number(userId) && offer.status === 'Confirmada') && (
          <button className="btn btn-green" onClick={handleComplete}>Completar oferta</button>
        )}
      </div>

      {/* Botón para reabrir */}
      {(offer.creator_id === Number(userId) && offer.status === 'Cerrada') && (
        <button className="btn btn-orange" onClick={handleReopen}>Reabrir oferta</button>
      )}

      {/* Botón para editar */}
      {(offer.creator_id === Number(userId) && offer.status === 'Abierta') && (
        <Link to={`/offers/edit/${offerId}`} className="btn btn-yellow">Editar oferta</Link>
      )}

      {/* Botón para enviar negociación */}

      {/* {(offer.status === 'Abierta') && (
        <button className="btn btn-yellow">Enviar negociación</button>
      )} */}
    </div>
  );
};

export default OfferDetails;
