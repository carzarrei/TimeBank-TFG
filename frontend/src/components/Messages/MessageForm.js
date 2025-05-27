import React, { useState, useEffect } from 'react';
import api from '../../api'; // Asegúrate de que la ruta sea correcta
import { login } from '../../routeNames';

const MessageForm = () => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [destinationEmail, setDestinationEmail] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
          alert('No estás autenticado. Por favor, inicia sesión.');
          window.location.href = login; // Redirigir al login si no hay token
          return;
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
            console.error('Error sending message:', error.response ? error.response.data : error.message);
            }
        
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="receiver">Correo Destinatario:</label>
                <input
                    type="text"
                    id="receiver"
                    value={destinationEmail}
                    onChange={(e) => setDestinationEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="subject">Asunto:</label>
                <textarea
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="body">Cuerpo:</label>
                <textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Enviar Mensaje</button>
        </form>
    );
};

export default MessageForm;