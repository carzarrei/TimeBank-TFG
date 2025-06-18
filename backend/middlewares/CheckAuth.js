import jwt from 'jsonwebtoken';
import { invalidAuth } from '../errorMessages.js';

const verifyLogin = (req, res, next) => {
  const token = req.headers['authorization'];
  console.log('Token recibido en middleware:', token); // 👈 Este log es clave

  if (!token) return res.status(401).send(invalidAuth);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Error al verificar token:', err.message); // 👈 Y este también
      return res.status(403).send(invalidAuth);
    }

    console.log('Token verificado correctamente:', decoded); // 👈 Y este
    req.user = decoded;
    next();
  });
};

  export default verifyLogin;