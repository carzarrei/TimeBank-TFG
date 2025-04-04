import { DataTypes } from 'sequelize';
import db from '../database/db.js';
import User from './User.js';
import Group from './Group.js';

const Request = db.define('requests', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
  group_creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: Group,
          key: 'id'
      }
  },
  creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: User,
          key: 'id'
      }
  },
  title: {
      type: DataTypes.STRING(255),
      allowNull: false
  },
  description: {
      type: DataTypes.TEXT,
      allowNull: false
  },
  requested_time: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  status: {
      type: DataTypes.ENUM('OPEN', 'ACCEPTED', 'CLOSED'),
      defaultValue: 'OPEN'
  }
}, {
  tableName: 'REQUESTS',
  timestamps: false
});

Request.belongsTo(User, { foreignKey: 'creadorId', allowNull: true });
Request.belongsTo(Group, { foreignKey: 'grupoId', allowNull: true });

export default Request;