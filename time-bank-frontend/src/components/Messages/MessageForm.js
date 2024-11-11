import React, { useState, useEffect } from 'react';
import api from '../../api'; // Asegúrate de que la ruta sea correcta

const MessageForm = () => {
    const [asunto, setAsunto] = useState('');
    const [cuerpo, setCuerpo] = useState('');
    const [correoDestino, setCorreoDestino] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
          alert('No estás autenticado. Por favor, inicia sesión.');
          window.location.href = '/login'; // Redirigir al login si no hay token
          return;
        }
      }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/messages', {
              correoDestino,
              asunto,
              cuerpo,
            }, {
              headers: {
                Authorization: token,
              },
            });
            console.log('Mensaje enviado:', response.data);
            alert('Mensaje enviado con éxito');
            setAsunto('');
            setCuerpo('');
            setCorreoDestino('');
          } catch (error) {
            console.error('Error sending message:', error.response ? error.response.data : error.message);
            }
        
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="destinatario">Correo Destinatario:</label>
                <input
                    type="text"
                    id="destinatario"
                    value={correoDestino}
                    onChange={(e) => setCorreoDestino(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="asunto">Asunto:</label>
                <textarea
                    id="asunto"
                    value={asunto}
                    onChange={(e) => setAsunto(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="cuerpo">Cuerpo:</label>
                <textarea
                    id="cuerpo"
                    value={cuerpo}
                    onChange={(e) => setCuerpo(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Enviar Mensaje</button>
        </form>
    );
};

export default MessageForm;