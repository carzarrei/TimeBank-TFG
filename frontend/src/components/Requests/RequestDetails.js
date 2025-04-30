import React, { useEffect, useState } from 'react';
import api from '../../api'; // Asegúrate de que la ruta sea correcta
import { Link } from 'react-router-dom';
import { login } from '../../routeNames';
import { useParams } from 'react-router-dom';

const RequestDetails = () => {
  const [request, setRequest] = useState([]);
  const {requestId} = useParams();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    
    if (!token) {
      alert('No estás autenticado. Por favor, inicia sesión.');
      window.location.href = login; // Redirigir al login si no hay token
      return;
    }

    const fetchData = async () => {
      try {
      const response = await api.get(`requests/${requestId}`, {
        headers: {
        Authorization: token,
        },
      });
      setRequest(response.data);
      } catch (error) {
      console.error('Error fetching requests:', error);
      }
    };
  
    fetchData();
    
    }, [requestId, token]);

    /*
    const handleAccept = async () => {
      try {
        const response = await api.post('/requests/'+${requestId}+'/accept', {}, {
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
    */
    return (
    <div>
      <h1>Detalles de la Solicitud</h1>
      <ul>
      <li key={request.id}>
        <h2>{request.title}</h2>
        {request.creator_id ? <Link to={'/profile/'+request.creator_id}><h3>{request.creator_id}</h3></Link> : null}
        {request.group_creator_id ? <Link to={'/groups/'+request.group_creator_id}><h3>{request.group_creator_id}</h3></Link> : null}
        <p>{request.description}</p>
        <p>Tiempo a intercambiar: {request.requested_time}</p>
        <p>Fecha de publicación: {new Date(request.publication_date).toLocaleDateString()}</p>
        <p>Estado: {request.status}</p>
        {request.accepted_by && (<p>Aceptada por: {request.accepted_by}</p>)}
      </li>
      </ul>
     
    </div>
    );
}

// {(request.creator_id!==userId)&&(request.status ==='Abierta')&&(<button onClick={handleAccept}>Aceptar Solicitud</button>)}
// {(request.accepted_by==userId)&&(request.status ==='Aceptada')&&(<button onClick={handleComplete}>Completar Solicitud</button>)}

export default RequestDetails;
