import { DataTypes } from 'sequelize';
import db from '../database/db.js';
import User from './User.js';

const Group = db.define('groups', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  admin_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
}, {
  tableName: 'GROUPS',
  timestamps: true,
});

export default Group;