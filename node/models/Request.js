import { DataTypes } from 'sequelize';
import db from '../database/db.js';
import User from './User.js';
import Group from './Group.js';

const Request = db.define('requests', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tiempoIntercambio: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fechaPublicacion: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pendiente',
  },
  creadorId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: true, // Puede estar vacío si es creado por un grupo
  },
  grupoId: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: 'id',
    },
    allowNull: true, // Puede estar vacío si es creado por un usuario individual
  },
}, {
  timestamps: true,
});

Request.belongsTo(User, { foreignKey: 'creadorId', allowNull: true });
Request.belongsTo(Group, { foreignKey: 'grupoId', allowNull: true });

export default Request;