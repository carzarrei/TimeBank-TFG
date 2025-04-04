import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const ReceivedMessageList = () => {
    const [messages, setMessages] = useState([]);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No estás autenticado. Por favor, inicia sesión.');
            window.location.href = '/login'; // Redirigir al login si no hay token
            return;
        }
        const fetchMessages = async () => {
            try {
            const response = await api.get('/messages/received', {
                headers: {
                Authorization: token,
                }
            });
            const messagesWithNames = await Promise.all(response.data.map(async (message) => {
                const userResponse = await api.get(`/users/${message.remitenteId}`, {
                headers: {
                    Authorization: token,
                },
                });
                return {
                ...message,
                remitenteNombre: userResponse.data.nombreCompleto || userResponse.data.correoElectronico,
                };
            }));
            setMessages(messagesWithNames);
            } catch (error) {
            console.error('Error fetching received messages:', error);
            }
        };

        fetchMessages();
    }, []);

    return (
        <div className="received-message-list">
            {messages.length > 0 ? (
                messages.map((message) => (
                    <div key={message.id}>
                        <Link to={`/profile/${message.remitenteId}`}><h2>De: {message.remitenteNombre}</h2></Link>
                        <p>{message.asunto}</p>
                        <p>{message.cuerpo}</p>
                    </div>
                ))
            ) : (
                <p>No hay mensajes recibidos</p>
            )}
        </div>
    );
};

export default ReceivedMessageList;