import Request from '../models/Request.js';
import { exchangeTimeBetweenUsers } from './userController.js';
import db from '../database/db.js';

export const createRequest = async (req, res) => {
  const { title, description, requestedTime, creadorId } = req.body;
  const userId = req.user.id;
  if (!title || !description || !requestedTime) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }
  if (requestedTime <= 0) {
    return res.status(400).json({ message: 'El tiempo solicitado debe ser mayor a 0' });
  }
  if (!userId) {
    return res.status(400).json({ message: 'El usuario no está autenticado' });
  }
  try {
    const request = await Request.create({
      title,
      description,
      requested_time: requestedTime,
      status: 'Abierta',
      publication_date: new Date(),
      creator_id: userId,
    });
    res.status(201).json(request);
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
    const request = await Request.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const acceptRequest = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const request = await Request.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    await request.update({ accepted_by: userId, status: 'Aceptada' });
    res.status(200).json({ message: 'Solicitud aceptada' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const confirmRequest = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const request = await Request.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    if (request.creator_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para confirmar esta request' });
    }
    await request.update({ status: 'Confirmada' });
    res.status(200).json({ message: 'Solicitud confirmada' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const completeRequest = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const request = await Request.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    if (request.accepted_by !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para completar esta request' });
    }
    const result = await db.transaction(async (t) => {
      await exchangeTimeBetweenUsers(request.creator_id, request.accepted_by, request.requested_time, t);
      await request.update({ accepted_by: null, status: 'Cerrada' }, { transaction: t });
    });
    res.status(200).json({ result, message: 'Solicitud completada' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}