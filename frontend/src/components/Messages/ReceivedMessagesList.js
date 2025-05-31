import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import { login, sentMessages } from '../../routeNames';
import '../../styles/Messages/messageList.css';

const ReceivedMessagesList = () => {
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No estás autenticado. Por favor, inicia sesión.');
            window.location.href = login;
            return;
        }

        const fetchMessages = async () => {
            try {
                const response = await api.get('/messages/received', {
                    headers: { Authorization: token }
                });

                const messagesWithSenders = await Promise.all(
                    response.data.map(async (msg) => {
                        const userResponse = await api.get(`/users/${msg.sender_id}`, {
                            headers: { Authorization: token }
                        });
                        return {
                            ...msg,
                            senderEmail: userResponse.data.email
                        };
                    })
                );

                setMessages(messagesWithSenders);
            } catch (error) {
                console.error('Error fetching received messages:', error);
            }
        };

        fetchMessages();
    }, []);

    const handleDeleteMessage = async (messageId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No estás autenticado. Por favor, inicia sesión.');
            window.location.href = login;
            return;
        }
        try {
            const deleteResponse = await api.delete(`/messages/received/${messageId}`, {
                headers: { Authorization: token }
            });
            alert(deleteResponse.data.message);
            setMessages(messages.filter(msg => msg.id !== messageId));
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    return (
        <div className="message-list-container">
            <div className="message-list-header">
                <h2 className="message-list-title">Mensajes Recibidos</h2>
                <button className="switch-button" onClick={() => navigate(sentMessages)}>
                    Ver enviados
                </button>
            </div>
            {messages.length > 0 ? (
                messages.map((message) => (
                    <div key={message.id} className="message-card">
                        <div className="message-info">
                            <p className="message-sender">De: {message.senderEmail}</p>
                            <p className="message-subject">{message.subject}</p>
                            <p className="message-date">Fecha: {new Date(message.date).toLocaleDateString()}</p>
                        </div>
                        <div className="message-actions">
                            <Link to={`/messages/${message.id}`} className="message-link">Ver Detalles</Link>
                            <button className="delete-button" onClick={() => handleDeleteMessage(message.id)}>
                                Eliminar Mensaje
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="no-messages">No hay mensajes recibidos</p>
            )}
        </div>
    );
};

export default ReceivedMessagesList;
