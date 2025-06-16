import {Group, Member} from '../models/index.js';
import { createGroupRequest, getGroupRequests } from './requestController.js';
import {getAllJoinRequestUsersFromGroup, getAllUsersFromGroup} from './userController.js';
import { createGroupOffer, getGroupOffers } from './offerController.js';

export const createGroup = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;
  try {
    const ismember = await Member.findOne({ where: { user_id: userId } });
    if (ismember) {
      return res.status(400).json({ message: 'Ya eres miembro de un grupo' });
    }
    const groupExists = await Group.findOne({ where: { name } });
    if (groupExists) {
      return res.status(400).json({ message: 'Este nombre de grupo ya existe' });
    }
    const group = await Group.create({
      name,
      admin_id: userId,
    });
    Member.create({
      user_id: userId,
      group_id: group.id,
      accumulated_time: 1,
      status: 'Miembro'
    });
    res.status(201).json("Grupo creado con éxito");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.findAll();
    res.status(200).json(groups);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getGroupById = async (req, res) => {
  const { id } = req.params;

  try {
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }
    res.status(200).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserGroup = async (req, res) => {
  const userId = req.user.id;
  try {
    const member = await Member.findOne({ where: { user_id: userId } });
    if (!member) {
      return res.status(404).json({ message: 'El usuario no pertenece a ningun grupo' });
    }
    const group = await Group.findByPk(member.group_id);
    if (!group) {
      return res.status(404).json({ message: 'Grupo no encontrado' });      
    }
    res.status(200).json(group);
  } catch (error) { 
    res.status(400).json({ error: error.message });
  }
};
  

export const getGroupMembers = async (req, res) => {
  const { id } = req.params;
  try {
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }
    const members = await getAllUsersFromGroup(id);
    res.status(200).json(members);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getGroupJoinRequests = async (req, res) => {
  const { id } = req.params;
  try {
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }
    if (group.admin_id !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para ver las solicitudes de unión' });
    }
    const requests = await getAllJoinRequestUsersFromGroup(id);
    res.status(200).json(requests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const requestJoinGroup = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }
    await createJoinRequest(userId, id);
    res.status(201).json({ message: 'Solicitud de union enviada' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const acceptJoinRequest = async (req, res) => {
  const { memberId } = req.params;
  const userId = req.user.id;
  try {
    const member = await Member.findByPk(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    const group = await Group.findByPk(member.group_id);
    if (!group) {
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }
    if (group.admin_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para aceptar esta solicitud' });
    }
    if (member.status === 'Miembro') {
      return res.status(400).json({ message: 'El usuario ya es miembro del grupo' });
    }
    await member.update({ status: 'Miembro' });
    await member.save();
    res.status(200).json({ message: 'Solicitud de union aceptada' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const rejectJoinRequest = async (req, res) => {
  const { memberId } = req.params;
  const userId = req.user.id;
  try {
    const member = await Member.findByPk(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    const group = await Group.findByPk(member.group_id);
    if (!group) {
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }
    if (group.admin_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para rechazar esta solicitud' });
    }
    await member.destroy();
    res.status(200).json({ message: 'Solicitud de union rechazada' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const leaveGroup = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }
    await removeUserFromGroup(userId);
    res.status(200).json({ message: 'Usuario eliminado del grupo' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const createJoinRequest = async (userId, groupId) => {
  try {
    const member = await Member.create({
      user_id: userId,
      group_id: groupId,
      accumulated_time: 1,
      status: 'Solicitud'
    });
  } catch (error) {
    console.error('Error al enviar la solicitud de union', error.message);
  }
}

const removeUserFromGroup = async (userId) => {
  try {
    const member = await Member.findOne({ where: { user_id: userId } });
    if (!member) {
      return;
    }
    await member.destroy();
  } catch (error) {
    console.error('Error al quitar al usuario del grupo', error.message);
  }
}

export const newGroupRequest = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, description, requestedTime } = req.body;
  try {
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }
    const member = await Member.findOne({ where: { user_id: userId, group_id: id } });
    if (!member) {
      return res.status(404).json({ message: 'El usuario no pertenece a este grupo' });
    }
    const requestData = {
      title,
      description,
      requestedTime: requestedTime,
      creatorId: userId
    };
    const request= await createGroupRequest(requestData, id);
    res.status(201).json({request, message: 'Solicitud grupal creada con éxito' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getOpenGroupRequests = async (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
  try {
    const member = await Member.findOne({ where: { user_id: userId, group_id: id } });
    if (!member) {
      return res.status(404).json({ message: 'El usuario no pertenece a este grupo' });
    }
    const openRequests = await getGroupRequests(id)
    res.status(200).json(openRequests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const newGroupOffer = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, description, offeredTime } = req.body;
  try {
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }
    const member = await Member.findOne({ where: { user_id: userId, group_id: id } });
    if (!member) {
      return res.status(404).json({ message: 'El usuario no pertenece a este grupo' });
    }
    const offerData = {
      title,
      description,
      offeredTime: offeredTime,
      creatorId: userId
    };
    const offer= await createGroupOffer(offerData, id);
    res.status(201).json({offer, message: 'Oferta grupal creada con éxito' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getOpenGroupOffers = async (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
  try {
    const member = await Member.findOne({ where: { user_id: userId, group_id: id } });
    if (!member) {
      return res.status(404).json({ message: 'El usuario no pertenece a este grupo' });
    }
    const openOffers = await getGroupOffers(id)
    res.status(200).json(openOffers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const exchangeTimeBetweenMembers = async (memberId, secondMemberId, groupId, time, transaction) => {
  const member = await Member.findOne({ where: { user_id: memberId, group_id: groupId } },{ transaction });
  const secondMember = await Member.findOne({ where: { user_id: secondMemberId, group_id: groupId } },{ transaction });

  if (!member || !secondMember) {
    throw new Error('Uno o ambos usuarios no existen.');
  }

  await member.update(
    { accumulated_time: Number(member.accumulated_time - time) },
    { transaction }
  );
  await secondMember.update(
    { accumulated_time: Number(secondMember.accumulated_time + time) },
    { transaction }
  );
};