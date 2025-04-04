const { DataTypes } = require('sequelize');
import db from '../database/db.js';
const User = require('./User');
const Group = require('./Group');

const Member = db.define('members', {
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
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Group,
            key: 'id'
        }
    },
    accumulated_time: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'MEMBERS',
    timestamps: false
});

Member.belongsTo(User, { foreignKey: 'user_id' });
Member.belongsTo(Group, { foreignKey: 'group_id' });

module.exports = Member;
