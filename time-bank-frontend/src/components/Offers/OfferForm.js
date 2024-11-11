import React, { useEffect, useState } from 'react';
import api from '../../api'; // Asegúrate de que la ruta sea correcta

const OfferForm = () => {
  // Estado para los campos del formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tiempoIntercambio, setTiempoIntercambio] = useState('');
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (!token) {
      alert('No estás autenticado. Por favor, inicia sesión.');
      window.location.href = '/login'; // Redirigir al login si no hay token
      return;
    }
  }, [token]);
  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Enviar los datos al backend
      const response = await api.post('/offers', {
        titulo,
        descripcion,
        tiempoIntercambio,
      }, {
        headers: {
          Authorization: token,
        },
      });

      // Manejar la respuesta del backend (por ejemplo, mostrar un mensaje o redirigir)
      console.log('Oferta creada:', response.data);
      alert('Oferta creada con éxito');
      // Opcional: Limpiar el formulario
      setTitulo('');
      setDescripcion('');
      setTiempoIntercambio('');
    } catch (error) {
      console.error('Error al crear la oferta:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h1>Crear Nueva Oferta</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="titulo">Título:</label>
          <input
            id="titulo"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="tiempoIntercambio">Tiempo a Intercambiar (horas):</label>
          <input
            id="tiempoIntercambio"
            type="number"
            value={tiempoIntercambio}
            onChange={(e) => setTiempoIntercambio(e.target.value)}
            required
          />
        </div>
        <button type="submit">Crear Oferta</button>
      </form>
    </div>
  );
};

export default OfferForm;
