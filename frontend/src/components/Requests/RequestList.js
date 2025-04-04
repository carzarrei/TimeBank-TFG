import React, { useEffect, useState } from 'react';
import api from '../../api';

const RequestList = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No estás autenticado. Por favor, inicia sesión.');
            window.location.href = '/login'; // Redirigir al login si no hay token
            return;
        }
        const fetchRequests = async () => {
            try {
                const response = await api.get('/requests', {
                    headers: {
                        Authorization: token,
                    },
                });
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };

        fetchRequests();
    }, []);

    return (
        <div>
            <h1>Solicitudes</h1>
            <ul>
                {requests.map((request) => (
                    <li key={request.id}>
                        <a href={`/requests/details/${request.id}`}>
                            <h2>{request.titulo}</h2>
                            <p>{request.descripcion}</p>
                            <p>Tiempo a intercambiar: {request.tiempoIntercambio}</p>
                            <p>Fecha de publicación: {new Date(request.fechaPublicacion).toLocaleDateString()}</p>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RequestList;
