import Group from '../models/Group.js';
import Member from '../models/Member.js';
import {getAllUsersFromGroup} from './userController.js';

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
      accumulated_time: 1
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

export const joinGroup = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }
    await addUserToGroup(userId, id);
    res.status(200).json({ message: 'Usuario añadido al grupo' });
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

const addUserToGroup = async (userId, groupId) => {
  try {
    const member = await Member.create({
      user_id: userId,
      group_id: groupId,
      accumulated_time: 1
    });
  } catch (error) {
    console.error('Error al añadir al usuario al grupo', error.message);
  }
}

const removeUserFromGroup = async (userId) => {
  try {
    const member = await Member.findOne({ where: { user_id: userId } });
    if (!member) {
      return res.status(404).json({ message: 'El usuario no pertenece a ningun grupo' });
    }
    await member.destroy();
  } catch (error) {
    console.error('Error al quitar al usuario del grupo', error.message);
  }
}