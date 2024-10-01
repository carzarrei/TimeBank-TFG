import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');
  const [habilidades, setHabilidades] = useState('');

  const navigate = useNavigate();

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
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      <div>
        <input
        type="text"
        placeholder="Nombre Completo"
        value={nombreCompleto}
        onChange={(e) => setNombreCompleto(e.target.value)}
        />
      </div>
      <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      </div>
      <div>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      </div>
      <div>
      <input
        type="text"
        placeholder="Localidad"
        value={localidad}
        onChange={(e) => setLocalidad(e.target.value)}
      />
      </div>
      <div>
      <input
        type="date"
        placeholder="Fecha de Nacimiento"
        value={fechaNacimiento}
        onChange={(e) => setFechaNacimiento(e.target.value)}
      />
      </div>
      <div>
      <input
        type="file"
      />
      </div>
      <div>
      <input
        type="text"
        placeholder="Habilidades"
        value={habilidades}
        onChange={(e) => setHabilidades(e.target.value)}
      />
      </div>
      <br />
      <div>
      <button type="submit">Register</button>
      </div>
    </form>
  );
};

export default Register;
