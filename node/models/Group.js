import { DataTypes } from 'sequelize';
import db from '../database/db.js';
import User from './User.js';

const Group = db.define('groups', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  administradorId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Relación entre grupo y miembros
Group.hasMany(User , { foreignKey: 'grupoId' });

export default Group;