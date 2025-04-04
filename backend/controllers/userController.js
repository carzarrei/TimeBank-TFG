import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res, next) => {
  const { name, email, password, location, birth_date, profile_picture, skills } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      location,
      birth_date,
      profile_picture,
      skills
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const editUser = async (req, res) => {
  const { id } = req.params;
  const { nombreCompleto, email, localidad, fechaNacimiento, fotoPerfil, habilidades } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    await user.update({
      nombreCompleto,
      email,
      localidad,
      fechaNacimiento,
      fotoPerfil,
      habilidades,
    });
    res.status(200).json(user).message('Usuario actualizado');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    return user;
  } catch (error) {
    console.error('Error getting user by email:', error.message);
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    await user.destroy();
    res.status(200).json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllUsersFromGroup = async (groupId) => {
  try {
    const users = await User.findAll({ where: { grupoId: groupId } });
    return users;
  } catch (error) {
    console.error('Error getting users by group:', error.message);
  }
}

export const addUserToGroup = async (userId, groupId) => {
  try {
    const user = await User.update({ grupoId: groupId }, { where: { id: userId } });
    return user;
  } catch (error) {
    console.error('Error getting user by email:', error.message);
  }
}

export const removeUserFromGroup = async (userId) => {
  try {
    const user = await User.update({ grupoId: null }, { where: { id: userId } });
    return user;
  } catch (error) {
    console.error('Error getting user by email:', error.message);
  }
}

export const exchangeTimeBetweenUsers = async (userId, otherUserId, time, transaction) => {
  try {
    const user = await User.findByPk(userId, { transaction });
    const otherUser = await User.findByPk(otherUserId, { transaction });
    if (!user || !otherUser) {
      return;
    }
    await user.update({ horasGlobales: user.horasGlobales - time }, { transaction });
    await otherUser.update({ horasGlobales: otherUser.horasGlobales + time }, { transaction });
    return;
  } catch (error) {
    console.error('Error interchanging time:', error.message);
  }
}