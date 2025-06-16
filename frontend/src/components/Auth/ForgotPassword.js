import React, { useState } from 'react';
import api from '../../api';
import { personalProfile } from '../../routeNames';
import '../../styles/Auth/forgotPassword.css'; // Ruta correcta según tu estructura

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const token = localStorage.getItem('token');
  if (token) {
    alert('Ya estás autenticado.');
    window.location.href = personalProfile;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/forgot-password', { email });
      setMsg(response?.data?.message);
    } catch (error) {
      setMsg(error?.response?.data?.message || 'Ocurrió un error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="forgot-password-container">
      <h1>Recuperar Contraseña</h1>
      <input
        type="email"
        placeholder="Tu correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Enviar</button>
      <p>{msg}</p>
    </form>
  );
};

export default ForgotPassword;
