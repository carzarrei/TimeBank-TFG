import { useState, useEffect } from 'react';
import api from '../../api';
import { login } from '../../routeNames';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Messages/messageForm.css';
import '../../styles/Messages/messageDetails.css';
import { useNavigate } from 'react-router-dom';

const MessageDetails = () => {
    const [message, setMessage] = useState();
    const token = localStorage.getItem('token');
    const { messageId } = useParams();
    const navigate = useNavigate();
    const userId = JSON.parse(localStorage.getItem('userId'));

    useEffect(() => {
        if (!token) {
            alert('No estás autenticado. Por favor, inicia sesión.');
            window.location.href = login;
        }
    }, [token]);

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const response = await api.get(`/messages/${messageId}`, {
                    headers: { Authorization: token }
                });
                setMessage(response.data);
            } catch (error) {
                console.error('Error fetching message:', error);
            }
        };

        fetchMessage();
    }, [token, messageId]);

    useEffect(() => {
        if (!message) return;

        const fetchMessageUsers = async () => {
            try {
                const senderResponse = await api.get(`/users/${message.sender_id}`, {
                    headers: { Authorization: token }
                });
                const receiverResponse = await api.get(`/users/${message.receiver_id}`, {
                    headers: { Authorization: token }
                });

                setMessage(prevMessage => ({
                    ...prevMessage,
                    senderEmail: senderResponse.data.email,
                    receiverEmail: receiverResponse.data.email
                }));
            } catch (error) {
                console.error('Error fetching message users:', error);
            }
        };
        fetchMessageUsers();
    }, [message, token]);

    console.log(JSON.parse(localStorage.getItem('userId')))
    return (
        <div className="message-details-container">
            <h2 className="message-details-title">Detalles del Mensaje</h2>
            {message ? (
                <div className="message-details-content">
                    <p><strong>De:</strong> 
                        <Link to={`/profile/${message.sender_id}`} className="email-link">
                            {` ${message.senderEmail}`}
                        </Link>
                    </p>
                    <p><strong>Para:</strong> 
                        <Link to={`/profile/${message.receiver_id}`} className="email-link">
                            {` ${message.receiverEmail}`}
                        </Link>
                    </p>
                    <p><strong>Asunto:</strong> <span className="highlight">{message.subject}</span></p>
                    <p><strong>Fecha:</strong> <span className="highlight">{new Date(message.date).toLocaleString()}</span></p>
                    <p><strong>Mensaje:</strong></p>
                    <div className="message-body">{message.body}</div>
                    {message.receiver_id === userId && (
                        <button
                            className="reply-button"
                            onClick={() => navigate('/messages/new', { state: { email: message.senderEmail, subject: `Re: ${message.subject}` } })}
                        >
                            Responder
                        </button>
                    )}
                </div>
            ) : (
                <p>Cargando mensaje...</p>
            )}
            <button className="back-button" onClick={() => window.history.back()}>
                Volver a la lista de mensajes
            </button>
        </div>
    );
};

export default MessageDetails;
