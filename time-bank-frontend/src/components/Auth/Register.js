import React, { useState } from 'react';
import api from '../../api';

const Register = () => {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');
  const [habilidades, setHabilidades] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/register', {
        nombreCompleto,
        email,
        password,
        localidad,
        fechaNacimiento,
        fotoPerfil,
        habilidades,
      });
      console.log('Registration successful:', response.data);
    } catch (error) {
      console.error('Registration error:', error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre Completo"
        value={nombreCompleto}
        onChange={(e) => setNombreCompleto(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Localidad"
        value={localidad}
        onChange={(e) => setLocalidad(e.target.value)}
        required
      />
      <input
        type="date"
        placeholder="Fecha de Nacimiento"
        value={fechaNacimiento}
        onChange={(e) => setFechaNacimiento(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Foto de Perfil"
        value={fotoPerfil}
        onChange={(e) => setFotoPerfil(e.target.value)}
      />
      <input
        type="text"
        placeholder="Habilidades"
        value={habilidades}
        onChange={(e) => setHabilidades(e.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
