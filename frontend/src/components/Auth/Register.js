import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [birth_date, setBirthDate] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [skills, setSkills] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/register', {
        name,
        email,
        password,
        location,
        birth_date,
        profilePicture,
        skills
      });
      console.log('Registration successful:', response.data);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Registrarse</h1>
      <div>
        <input
        type="text"
        placeholder="Nombre Completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
      <input
        type="email"
        placeholder="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      </div>
      <div>
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      </div>
      <div>
      <input
        type="text"
        placeholder="Ubicación"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      </div>
      <div>
      <input
        type="date"
        placeholder="Fecha de Nacimiento"
        value={birth_date}
        onChange={(e) => setBirthDate(e.target.value)}
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
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />
      </div>
      <br />
      <div>
      <button type="submit">Registrarse</button>
      </div>
    </form>
  );
};

export default Register;
