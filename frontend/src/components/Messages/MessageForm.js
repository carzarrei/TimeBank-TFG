import { useState, useEffect } from 'react';
import api from '../../api';
import { login } from '../../routeNames';
import '../../styles/Messages/messageForm.css';

const MessageForm = () => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [destinationEmail, setDestinationEmail] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            alert('No estás autenticado. Por favor, inicia sesión.');
            window.location.href = login;
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/messages', {
                destinationEmail,
                subject,
                body,
            }, {
                headers: {
                    Authorization: token,
                },
            });
            console.log('Mensaje enviado:', response.data);
            alert('Mensaje enviado con éxito');
            setSubject('');
            setBody('');
            setDestinationEmail('');
        } catch (error) {
            console.error('Error al enviar el mensaje:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="message-form-container">
            <h2 className="message-form-title">Enviar mensaje</h2>
            <form onSubmit={handleSubmit} className="message-form">
                <div className="form-group">
                    <label htmlFor="receiver">Correo Destinatario:</label>
                    <input
                        type="email"
                        id="receiver"
                        value={destinationEmail}
                        onChange={(e) => setDestinationEmail(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="subject">Asunto:</label>
                    <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="body">Cuerpo:</label>
                    <textarea
                        id="body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                        className="form-textarea"
                    />
                </div>
                <button type="submit" className="form-button">Enviar Mensaje</button>
            </form>
        </div>
    );
};

export default MessageForm;
