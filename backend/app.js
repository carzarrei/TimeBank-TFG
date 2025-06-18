import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database/db.js';
import offerRoutes from './routes/offerRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use('/uploads/profile_pictures', express.static(path.join(__dirname, 'uploads/profile_pictures')));

// Iniciar el servidor
app.listen(4000, () => {
  console.log('Servidor corriendo en el puerto 4000');
});

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Redirigir cualquier otra ruta al index.html (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});
