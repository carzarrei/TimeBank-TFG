import { DataTypes } from 'sequelize';
import db from '../database/db.js';
import User from './User.js';

const Message = db.define('messages', {
  remitenteId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
  destinatarioId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
  asunto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cuerpo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fechaEnvio: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: false,
});

Message.belongsTo(User, { as: 'remitente', foreignKey: 'remitenteId' });
Message.belongsTo(User, { as: 'destinatario', foreignKey: 'destinatarioId' });

export default Message;