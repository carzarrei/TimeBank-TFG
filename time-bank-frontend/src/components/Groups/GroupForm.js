import React, { useState, useEffect } from 'react';
import api from '../../api'; // Asegúrate de que la ruta sea correcta

const GroupForm = () => {
    const [nombre, setNombre] = useState('');
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
            const response = await api.post('/groups', {
              nombre,
            }, {
              headers: {
                Authorization: token,
              },
            });
            console.log('Grupo creado', response.data);
            alert('Grupo creado con éxito');
            setNombre('');
          } catch (error) {
            console.error('Error sending message:', error.response ? error.response.data : error.message);
            alert(error.response.data.message);
            }
        
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="nombre">Nombre del grupo:</label>
                <input
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Crear Grupo</button>
        </form>
    );
};

export default GroupForm;