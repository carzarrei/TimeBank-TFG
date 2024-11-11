import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database/db.js';
import offerRoutes from './routes/offerRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';
import groupRoutes from './routes/groupRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Conectar a la base de datos
db.authenticate()
  .then(() => console.log('Conectado a la base de datos MySQL'))
  .catch((err) => console.log('Error al conectar a la base de datos', err));

//  db.sync({ force: false })

// Rutas
app.use('/offers', offerRoutes);
app.use('/requests', requestRoutes);
app.use('/messages', messageRoutes);
app.use('/users', userRoutes);
app.use('/groups', groupRoutes);

// Iniciar el servidor
app.listen(4000, () => {
  console.log('Servidor corriendo en el puerto 4000');
});
