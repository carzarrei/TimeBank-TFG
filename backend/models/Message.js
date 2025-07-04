import { DataTypes } from 'sequelize';
import db from '../database/db.js';
import User from './User.js';

const Message = db.define('messages', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
  sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: User,
          key: 'id'
      }
  },
  receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: User,
          key: 'id'
      }
  },
  subject: {
      type: DataTypes.STRING(255),
      allowNull: false 
  },
  body: {
      type: DataTypes.TEXT,
      allowNull: false
  },
  date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'MESSAGES',
  timestamps: false
});

export default Message;