import { exchangeTimeBetweenUsers } from './userController.js';
import db from '../database/db.js';
import { exchangeTimeBetweenMembers } from './groupController.js';
import { Request, User, Member } from '../models/index.js';
export const createRequest = async (req, res) => {
  const { title, description, requestedTime } = req.body;
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
    res.status(201).json({request,  message: 'Solicitud creada' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllRequests = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findByPk(userId);
    if (!user.is_admin) {
      return res.status(403).json({ message: 'No tienes permiso para ver todas las solicitudes' });
    }
    const solicitudes = await Request.findAll();
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getOpenRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const openRequests = await Request.findAll({ 
      where: { 
      status: 'Abierta', 
      group_id: null, 
      creator_id: { [db.Sequelize.Op.ne]: userId } 
      } 
    });
    res.status(200).json(openRequests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserRequests = async (req, res) => {
  const userId = req.user.id;
  try {
    const userRequests = await Request.findAll({ where: { creator_id: userId } });
    res.status(200).json(userRequests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getUserAcceptedRequests = async (req, res) => {
  const userId = req.user.id;
  try {
    const acceptedRequests = await Request.findAll({ where: { accepted_by: userId, status: 'Aceptada' } });
    res.status(200).json(acceptedRequests);
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
    if (request.group_id) {
      const member = await Member.findOne({ where: { user_id: req.user.id, group_id: request.group_id, status: 'Miembro' } });
      if (!member) {
        return res.status(403).json({ message: 'No tienes permiso para ver esta solicitud' });
      }
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateRequest = async (req, res) => {
  const { id } = req.params;
  const { title, description, requestedTime } = req.body;
  const userId = req.user.id;
  try {
    const request = await Request.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    if (request.creator_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta solicitud' });
    }
    if (title) request.title = title;
    if (description) request.description = description;
    if (requestedTime) request.requested_time = requestedTime;
    await request.save();
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
    if (request.creator_id === userId) {
      return res.status(403).json({ message: 'No puedes aceptar tu propia solicitud' });
    }
    if (request.group_id) {
      const member = await Member.findOne({ where: { user_id: userId, group_id: request.group_id, status: 'Miembro' } });
      if (!member) {
        return res.status(403).json({ message: 'No tienes permiso para aceptar esta solicitud' });
      }
    }
    if (request.status !== 'Abierta') {
      return res.status(400).json({ message: 'Solo se pueden aceptar solicitudes abiertas' });
    }
    
    await request.update({ accepted_by: userId, status: 'Aceptada' });
    res.status(200).json({ message: 'Solicitud aceptada' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const cancelRequest = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const request = await Request.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    if (request.accepted_by !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para cancelar esta solicitud' });
    }
    await request.update({ status: 'Cancelada', accepted_by: null });
    res.status(200).json({ message: 'Solicitud cancelada' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const confirmCancelationRequest = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const request = await Request.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    if (request.creator_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para confirmar la cancelación de esta solicitud' });
    }
    await request.update({ status: 'Abierta', accepted_by: null });
    res.status(200).json({ message: 'Solicitud cancelada' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const confirmRequest = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const request = await Request.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    if (request.creator_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para confirmar esta solicitud' });
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
    var result = null;
    if (request.group_id === null) {
      result = await db.transaction(async (t) => {
        await exchangeTimeBetweenUsers(request.creator_id, request.accepted_by, request.requested_time, t);
        await request.update({ accepted_by: null, status: 'Cerrada' }, { transaction: t });
      });
    } else {
      result = await db.transaction(async (t) => {
        await exchangeTimeBetweenMembers(request.creator_id, request.accepted_by, request.group_id, request.requested_time, t);
        await request.update({ accepted_by: null, status: 'Cerrada' }, { transaction: t });
      });
    } 
    if (result === null) {
      return res.status(400).json({ message: 'Error al completar la solicitud' });
    } else {
      res.status(200).json({ result, message: 'Solicitud completada' });
    }    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const reopenRequest = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const request = await Request.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    if (request.creator_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para reabrir esta solicitud' });
    }
    await request.update({ status: 'Abierta' });
    res.status(200).json({ message: 'Solicitud reabierta' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getGroupRequests = async (groupId) => {
  try {
    const requests = await Request.findAll({
      where: { group_id: groupId, status: 'Abierta' },
    });
    return requests;
  } catch (error) {
    console.error('Error getting requests by group:', error.message);
  }
}

export const createGroupRequest = async (requestData, groupId) => {
  const { title, description, requestedTime, creatorId } = requestData;
  try {
    const request = await Request.create({
      title,
      description,
      requested_time: requestedTime,
      status: 'Abierta',
      publication_date: new Date(),
      creator_id: creatorId,
      group_id: groupId,
    });
    return request;
  } catch (error) {
    console.error('Error creating group request:', error.message);
  }
}