import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import { login } from '../../routeNames';
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

    return (
        <div className="message-list-container">
            <div className="message-list-header">
                <h2 className="message-list-title">Mensajes Recibidos</h2>
                <button className="switch-button" onClick={() => navigate('/messages/sent')}>
                    Ver enviados
                </button>
            </div>
            {messages.length > 0 ? (
                messages.map((message) => (
                    <div key={message.id} className="message-card">
                        <Link to={`/profile/${message.sender_id}`} className="message-sender">
                            De: {message.senderEmail}
                        </Link>
                        <p className="message-subject">{message.subject}</p>
                        <p className="message-body">{message.body}</p>
                    </div>
                ))
            ) : (
                <p className="no-messages">No hay mensajes recibidos</p>
            )}
        </div>
    );
};

export default ReceivedMessagesList;
