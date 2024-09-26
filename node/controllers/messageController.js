import Message from '../models/Message.js';

export const createMessage = async (req, res) => {
  const { remitenteId, destinatarioId, asunto, cuerpo } = req.body;

  try {
    const mensaje = await Message.create({
      remitenteId,
      destinatarioId,
      asunto,
      cuerpo,
      fechaEnvio: new Date(),
    });
    res.status(201).json(mensaje);
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
