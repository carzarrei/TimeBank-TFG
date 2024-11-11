import Request from '../models/Request.js';

export const createRequest = async (req, res) => {
  const { titulo, descripcion, tiempoIntercambio, creadorId, grupoId } = req.body;
  const userId = req.user.id;
  try {
    const solicitud = await Request.create({
      titulo,
      descripcion,
      tiempoIntercambio,
      fechaPublicacion: new Date(),
      creadorId: userId || null,
      grupoId: grupoId || null,
    });
    res.status(201).json(solicitud);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const solicitudes = await Request.findAll();
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getRequestById = async (req, res) => {
  const { id } = req.params;

  try {
    const solicitud = await Request.findByPk(id);
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    res.status(200).json(solicitud);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const acceptRequest = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const solicitud = await Request.findByPk(id);
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    await solicitud.update({ aceptadaPor: userId, estado: 'aceptada' });
    res.status(200).json({ message: 'Solicitud aceptada' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const completeRequest = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const solicitud = await Request.findByPk(id);
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    const result = await db.transaction(async (t) => {
      await exchangeTimeBetweenUsers(solicitud.creadorId, userId, solicitud.tiempoIntercambio, t);
      await solicitud.update({ aceptadaPor: null, estado: 'cerrada' }, { transaction: t });
    });
    res.status(200).json({ result, message: 'Solicitud completada' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}