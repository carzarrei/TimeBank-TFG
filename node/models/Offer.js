import { DataTypes } from 'sequelize';
import db from '../database/db.js';
import User from './User.js';

const Offer = db.define('offers', {
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
    type: DataTypes.ENUM('abierta', 'aceptada', 'cerrada'),
    allowNull: false,
    defaultValue: 'abierta',
  },
  aceptadaPor: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: true,
  },
  creadorId: {
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

Offer.belongsTo(User, { foreignKey: 'creadorId' });

export default Offer;