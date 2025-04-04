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
            const response = await api.get('/messages/sent', {
                headers: {
                Authorization: token,
                }
            });
            const messagesWithNames = await Promise.all(response.data.map(async (message) => {
                const userResponse = await api.get(`/users/${message.destinatarioId}`, {
                headers: {
                    Authorization: token,
                },
                });
                return {
                ...message,
                destinatarioNombre: userResponse.data.nombreCompleto || userResponse.data.correoElectronico,
                };
            }));
            setMessages(messagesWithNames);
            } catch (error) {
            console.error('Error fetching sent messages:', error);
            }
        };

        fetchMessages();
    }, []);

    return (
        <div className="received-message-list">
            {messages.length > 0 ? (
                messages.map((message) => (
                    <div key={message.id}>
                        <Link to={`/profile/${message.destinatarioId}`}><h2>Para: {message.destinatarioNombre}</h2></Link>
                        <p>{message.asunto}</p>
                        <p>{message.cuerpo}</p>
                    </div>
                ))
            ) : (
                <p>No hay mensajes enviados</p>
            )}
        </div>
    );
};

export default ReceivedMessageList;