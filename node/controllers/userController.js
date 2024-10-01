import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res, next) => {
  const { nombreCompleto, email, password, localidad, fechaNacimiento, fotoPerfil, habilidades } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      nombreCompleto,
      email,
      password: hashedPassword,
      localidad,
      fechaNacimiento,
      fotoPerfil,
      habilidades,
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
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
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
