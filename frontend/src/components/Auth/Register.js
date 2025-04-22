import React, { useState } from 'react';
import api from '../../api';
import { login } from '../../routeNames.js';
import '../../styles/Auth/register.css'; // Asegúrate de importar los estilos

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [birth_date, setBirthDate] = useState('');
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      console.log('Registration successful:', response.data);
      window.location.href = login;
    } catch (error) {
      console.error('Registration error:', error.response?.data);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h1 className="register-title">Registrarse</h1>

      <input
        type="text"
        placeholder="Nombre Completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="register-input"
        required
      />

      <input
        type="email"
        placeholder="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="register-input"
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="register-input"
        required
      />

      <input
        type="text"
        placeholder="Ubicación"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="register-input"
        required
      />

      <input
        type="date"
        placeholder="Fecha de Nacimiento"
        value={birth_date}
        onChange={(e) => setBirthDate(e.target.value)}
        className="register-input"
        required
      />

      <input type="file" className='register-input' onChange={(e) => setFile(e.target.files[0])} />  

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