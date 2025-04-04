import { DataTypes } from 'sequelize';
import db from '../database/db.js';
import User from './User.js';

const Offer = db.define('offers', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
  user_id: {
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
  offered_time: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  status: {
      type: DataTypes.ENUM('OPEN', 'ACCEPTED', 'CLOSED'),
      defaultValue: 'OPEN'
  }
}, {
  tableName: 'OFFERS',
  timestamps: false
});

Offer.belongsTo(User, { foreignKey: 'creadorId' });

export default Offer;