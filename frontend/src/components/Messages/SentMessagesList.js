import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import { login } from '../../routeNames';
import '../../styles/Messages/messageList.css';

const SentMessagesList = () => {
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
                const response = await api.get('/messages/sent', {
                    headers: { Authorization: token }
                });

                const messagesWithReceivers = await Promise.all(
                    response.data.map(async (msg) => {
                        const userResponse = await api.get(`/users/${msg.receiver_id}`, {
                            headers: { Authorization: token }
                        });
                        return {
                            ...msg,
                            destinationEmail: userResponse.data.email
                        };
                    })
                );

                setMessages(messagesWithReceivers);
            } catch (error) {
                console.error('Error fetching sent messages:', error);
            }
        };

        fetchMessages();
    }, []);

    return (
        <div className="message-list-container">
            <div className="message-list-header">
                <h2 className="message-list-title">Mensajes Enviados</h2>
                <button className="switch-button" onClick={() => navigate('/messages/received')}>
                    Ver recibidos
                </button>
            </div>
            {messages.length > 0 ? (
                messages.map((message) => (
                    <div key={message.id} className="message-card">
                        <Link to={`/profile/${message.receiver_id}`} className="message-sender">
                            Para: {message.destinationEmail}
                        </Link>
                        <p className="message-subject">{message.subject}</p>
                        <p className="message-body">{message.body}</p>
                    </div>
                ))
            ) : (
                <p className="no-messages">No hay mensajes enviados</p>
            )}
        </div>
    );
};

export default SentMessagesList;
