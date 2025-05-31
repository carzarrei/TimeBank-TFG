import Message from '../models/Message.js';
import { getUserByEmail } from './userController.js';
import { Op } from 'sequelize';

export const createMessage = async (req, res) => {
  const { destinationEmail, subject, body } = req.body;
  const userId = req.user.id;
  
  try {
    const receiver = await getUserByEmail(destinationEmail);
    const receiverId = receiver?receiver.id: null;
    if (!receiver) {
      res.status(404).json({ message: 'Destinatario no encontrado' });
    } else if (receiverId === userId) {
      res.status(400).json({ message: 'No puedes enviarte un mensaje a ti mismo' });
    } else {
      const mensaje = await Message.create({
        sender_id: userId,
        receiver_id: receiverId,
        subject,
        body,
        date: new Date(),
      });
      res.status(201).json({message: 'Mensaje enviado correctamente' , mensaje});
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
        [Op.or]: [
          { sender_id: senderId, receiver_id: receiverId },
          { sender_id: receiverId, receiver_id: senderId }
        ]
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

export const getMessageById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const message = await Message.findOne({
      where: {
        id
      }
    });
    if (!message) {
      return res.status(404).json({ message: 'Mensaje no encontrado' });
    }
    if (message.receiver_id !== userId && message.sender_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para ver este mensaje' });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const deleteReceivedMessage = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const message = await Message.findOne({
      where: {
        id,
        receiver_id: userId
      }
    });

    if (!message) {
      return res.status(404).json({ message: 'Mensaje no encontrado' });
    }
    if (userId !== message.receiver_id) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este mensaje' });
    }
    await message.destroy();
    res.status(200).json({ message: 'Mensaje eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const cancelSentMessage = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const message = await Message.findOne({
      where: {
        id,
        sender_id: userId
      }
    });

    if (!message) {
      return res.status(404).json({ message: 'Mensaje no encontrado' });
    }
    if (userId !== message.sender_id) {
      return res.status(403).json({ message: 'No tienes permiso para cancelar este mensaje' });
    }
    await message.destroy();
    res.status(200).json({ message: 'Mensaje cancelado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
