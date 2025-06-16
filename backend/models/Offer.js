import { DataTypes } from 'sequelize';
import db from '../database/db.js';
import User from './User.js';
import Group from './Group.js';

const Offer = db.define('offers', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    creator_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
      group_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
              model: Group,
              key: 'id'
          }
      },
      accepted_by: {
          type: DataTypes.INTEGER,
          allowNull: true,
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
    offered_time: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    publication_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.ENUM('Abierta', 'Aceptada', 'Confirmada', 'Cancelada', 'Cerrada'),
        defaultValue: 'Abierta'
    },
}, {
  tableName: 'OFFERS',
  timestamps: false
});

export default Offer;