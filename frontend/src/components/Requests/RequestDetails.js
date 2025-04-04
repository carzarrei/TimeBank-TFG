import React, { useEffect, useState } from 'react';
import api from '../../api'; // Asegúrate de que la ruta sea correcta
import { Link } from 'react-router-dom';

const RequestDetails = () => {
  const [request, setRequest] = useState([]);
  const requestId = window.location.pathname.split('/').pop();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    
    if (!token) {
      alert('No estás autenticado. Por favor, inicia sesión.');
      window.location.href = '/login'; // Redirigir al login si no hay token
      return;
    }

    const fetchRequest = async () => {
      try {
      const response = await api.get('/requests/'+requestId, {
        headers: {
        Authorization: token,
        },
      });
      let creatorResponse = null;
      if (response.data.creadorId) {
        creatorResponse = await api.get('/users/'+response.data.creadorId, {
          headers: {
          Authorization: token,
          },
        });
      } else {
        creatorResponse = await api.get('/users/'+response.data.grupoId, {
          headers: {
          Authorization: token,
          },
        });
      }
      response.data.creadorNombre = creatorResponse.data.nombreCompleto;
      setRequest(response.data);
      } catch (error) {
      console.error('Error fetching requests:', error);
      }
    };
  
    fetchRequest();
    
    }, [requestId, token]);

    const handleAccept = async () => {
      try {
        const response = await api.post('/requests/'+requestId+'/accept', {}, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        console.log('Solicitud aceptada:', response.data);
        alert('Solicitud aceptada con éxito');
        window.location.reload();
      } catch (error) {
        console.error('Error accepting offer:', error);
      }
    }

    const handleComplete = async () => {
      try {
        const response = await api.post('/requests/'+requestId+'/complete', {}, {
          headers: {
            Authorization: token,
          },
        });
        console.log('Solicitud completada:', response.data);
        alert('Solicitud completada con éxito');
        window.location.reload();
      } catch (error) {
        console.error('Error completing offer:', error);
      }
    }

    return (
    <div>
      <h1>Detalles de la Solicitud</h1>
      <ul>
      <li key={request.id}>
        <h2>{request.titulo}</h2>
        {request.creadorId ? <Link to={'/profile/'+request.creadorId}><h3>{request.creadorNombre}</h3></Link> : null}
        {request.grupoId ? <Link to={'/groups/'+request.grupoId}><h3>{request.grupoId}</h3></Link> : null}
        <p>{request.descripcion}</p>
        <p>Tiempo a intercambiar: {request.tiempoIntercambio}</p>
        <p>Fecha de publicación: {new Date(request.fechaPublicacion).toLocaleDateString()}</p>
        <p>Estado: {request.estado}</p>
        {request.aceptadaPor && (<p>Aceptada por: {request.aceptadaPor}</p>)}
      </li>
      </ul>
      {(request.creadorId!=userId)&&(request.estado ==='abierta')&&(<button onClick={handleAccept}>Aceptar Solicitud</button>)}
      {(request.aceptadaPor==userId)&&(request.estado ==='aceptada')&&(<button onClick={handleComplete}>Completar Solicitud</button>)}
    </div>
    );
}

export default RequestDetails;
