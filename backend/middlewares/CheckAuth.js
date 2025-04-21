import jwt from 'jsonwebtoken';
import { invalidAuth } from '../errorMessages';

const verifyLogin = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send(invalidAuth);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).send(invalidAuth);
      req.user = decoded; // Almacenar el usuario decodificado en `req.user`
      next();
    });
  };

  export default verifyLogin;