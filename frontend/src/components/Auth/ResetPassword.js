import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { personalProfile } from '../../routeNames';
import '../../styles/Auth/resetPassword.css';

const ResetPassword = () => {
  const { tokenResetPassword } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const token = localStorage.getItem('token');
  if (token) {
    alert('Ya estás autenticado.');
    window.location.href = personalProfile;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (tokenResetPassword) {
      try {
        const response = await api.post(`/users/reset-password/${tokenResetPassword}`, {
          newPassword
        });
        setSuccessMessage(response?.data?.message);
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        setError(err?.response?.data?.message || 'Hubo un error al restablecer la contraseña.');
      }
    } else {
      setError('Token no encontrado en la URL');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Restablecer contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Restablecer</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default ResetPassword;