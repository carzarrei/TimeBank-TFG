import Group from '../models/Group.js';
import { addUserToGroup, getAllUsersFromGroup, removeUserFromGroup } from './userController.js';

export const createGroup = async (req, res) => {
  const { nombre } = req.body;
  const userId = req.user.id;
  try {
    if (req.user.grupoId !== null){
      return res.status(400).json({ message: 'El usuario ya pertenece a un grupo' });
    }
    const group = await Group.create({
      nombre,
      administradorId: userId,
    });
    await addUserToGroup(userId, group.id);
    res.status(201).json(group);
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

export const deleteGroup = async (req, res) => {
  const { id } = req.params;
  try {
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }
    await group.destroy();
    res.status(200).json({ message: 'Grupo eliminado' });
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
