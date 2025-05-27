import Message from '../models/Message.js';
import { getUserByEmail } from './userController.js';

export const createMessage = async (req, res) => {
  const { destinationEmail, subject, body } = req.body;
  const userId = req.user.id;
  
  try {
    const receiver = await getUserByEmail(destinationEmail);
    const receiverId = receiver?receiver.id: null;
    if (!receiver) {
      res.status(404).json({ message: 'Destinatario no encontrado' });
    }
    else if (receiverId === userId) {
      res.status(400).json({ message: 'No puedes enviarte un mensaje a ti mismo' });
    }
    else{
      const mensaje = await Message.create({
        sender_id: userId,
        receiver_id: receiverId,
        subject,
        body,
        date: new Date(),
      });
      res.status(201).json(mensaje);
    }
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getMessagesBetweenUsers = async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    const messages = await Message.findAll({
      where: {
        sender_id: senderId,
        receiver_id: receiverId
      } || {
        sender_id: receiverId,
        receiver_id: senderId
      },
      order: [['date', 'ASC']],
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getReceivedMessages = async (req, res) => {
  const userId = req.user.id;
  try {
    const messages = await Message.findAll({
      where: {
        receiver_id: userId
      },
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSentMessages = async (req, res) => { 
  const userId = req.user.id;

  try {
    const messages = await Message.findAll({
      where: {
        sender_id: userId
      },
      order: [['date', 'ASC']],
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
