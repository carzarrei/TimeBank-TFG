import { DataTypes } from 'sequelize';
import db from '../database/db.js';

const User = db.define('users', {
  name: {
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
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  profile_picture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  accumulated_time: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  skills: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
}, {
  tableName: 'USERS',
  timestamps: false,
});

export default User;