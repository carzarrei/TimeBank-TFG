import Message from '../models/Message.js';
import { getUserByEmail } from './userController.js';

export const createMessage = async (req, res) => {
  const { correoDestino, asunto, cuerpo } = req.body;
  const userId = req.user.id;
  
  try {
    const destinatario = await getUserByEmail(correoDestino);
    const destinatarioId = destinatario.id;

    if (!destinatario) {
      res.status(404).json({ message: 'Destinatario no encontrado' });
    }
    else{
      const mensaje = await Message.create({
        remitenteId: userId,
        destinatarioId: destinatarioId,
        asunto,
        cuerpo,
        fechaEnvio: new Date(),
      });
      res.status(201).json(mensaje);
    }
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getMessagesBetweenUsers = async (req, res) => {
  const { remitenteId, destinatarioId } = req.params;

  try {
    const mensajes = await Message.findAll({
      where: {
        remitenteId,
        destinatarioId
      },
      order: [['fechaEnvio', 'ASC']],
    });
    res.status(200).json(mensajes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getReceivedMessages = async (req, res) => {
  const userId = req.user.id;

  try {
    const mensajes = await Message.findAll({
      where: {
        destinatarioId: userId
      },
      order: [['fechaEnvio', 'ASC']],
    });
    res.status(200).json(mensajes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSentMessages = async (req, res) => { 
  const userId = req.user.id;

  try {
    const mensajes = await Message.findAll({
      where: {
        remitenteId: userId
      },
      order: [['fechaEnvio', 'ASC']],
    });
    res.status(200).json(mensajes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
