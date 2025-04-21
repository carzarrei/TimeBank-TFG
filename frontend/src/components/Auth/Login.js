import React, { useState } from 'react';
import api from '../../api';
import { perfilPersonal } from '../../routeNames.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const token = localStorage.getItem('token');
      if (token) {
        alert('Ya estás autenticado.');
        window.location.href = perfilPersonal; // Redirigir al home si ya hay token
      } 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login', { email, password });
      console.log('Login successful:', response.data);
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user.id);
        window.location = perfilPersonal;
      } else {
        console.error('Login error:', response.data);
      }
    } catch (error) {
      console.error('Login error:', error.response.data);
      alert(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      </div>
      <div>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
