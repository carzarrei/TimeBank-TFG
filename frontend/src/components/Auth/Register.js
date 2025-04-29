import React, { useState } from 'react';
import api from '../../api';
import { login } from '../../routeNames.js';
import '../../styles/Auth/register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('');
  const [birth_date, setBirthDate] = useState('');
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('location', location);
      formData.append('birth_date', birth_date);
      formData.append('skills', skills);
      formData.append('profilePicture', file); // aquí va el archivo

      const response = await api.post('/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      window.location.href = login;
    } catch (error) {
        setError(error.response.data.message);
    }
  };

  return (
    
    <form className="register-form" onSubmit={handleSubmit}>
      <h1 className="register-title">Registrarse</h1>
      {error && <p className="register-error">{error}</p>}
      <input
        type="text"
        placeholder="Nombre Completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="register-input"
      />

      <input
        type="email"
        placeholder="Correo Electrónico"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError('');
        }}
        className="register-input"
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="register-input"
      />

      <input
        type="password"
        placeholder="Confirmar Contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="register-input"
      />

      <input
        type="text"
        placeholder="Ubicación"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="register-input"
      />

      <input
        type="date"
        placeholder="Fecha de Nacimiento"
        value={birth_date}
        onChange={(e) => setBirthDate(e.target.value)}
        className="register-input"
      />
  
      <input name="profilePicture" type="file" className='register-input' onChange={(e) => setFile(e.target.files[0])} />  

      <input
        type="text"
        placeholder="Habilidades (separadas por comas)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        className="register-input"
      />

      

      <button type="submit" className="register-button">Registrarse</button>
    </form>
  );
};

export default Register;
