import { DataTypes } from 'sequelize';
import db from '../database/db.js';

const User = db.define('users', {
  nombreCompleto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  localidad: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fechaNacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  fotoPerfil: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  horasGlobales: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  habilidades: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  timestamps: true,
});

export default User;