import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { login } from '../../routeNames';

const SentMessageList = () => {
    const [messages, setMessages] = useState([]);
    

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No estás autenticado. Por favor, inicia sesión.');
            window.location.href = login; // Redirigir al login si no hay token
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
                const userResponse = await api.get(`/users/${message.receiver_id}`, {
                headers: {
                    Authorization: token,
                },
                });
                return {
                ...message,
                destinationEmail: userResponse.data.email,
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
                        <Link to={`/profile/${message.receiver_id}`}><h2>Para: {message.destinationEmail}</h2></Link>
                        <p>{message.subject}</p>
                        <p>{message.body}</p>
                    </div>
                ))
            ) : (
                <p>No hay mensajes enviados</p>
            )}
        </div>
    );
};

export default SentMessageList;