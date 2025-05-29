import { useState, useEffect } from 'react';
import api from '../../api';
import { login } from '../../routeNames';
import '../../styles/Messages/messageForm.css';
import { useParams } from 'react-router-dom';
import { use } from 'react';

const MessageDetails = () => {
    const [message, setMessage] = useState();
    const token = localStorage.getItem('token');
    const {messageId} = useParams();

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
    }, [token]);

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
        }
        fetchMessageUsers();
    }, [message, token]);


    return (
        <div className="message-details-container">
            <h2 className="message-details-title">Detalles del Mensaje</h2>
            {message ? (
                <div className="message-details-content">
                    <p><strong>De:</strong> {message.senderEmail}</p>
                    <p><strong>Para:</strong> {message.receiverEmail}</p>
                    <p><strong>Asunto:</strong> {message.subject}</p>
                    <p><strong>Fecha:</strong> {new Date(message.date).toLocaleString()}</p>
                    <p><strong>Mensaje:</strong></p>
                    <div className="message-body">{message.body}</div>
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
