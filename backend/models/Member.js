import { DataTypes } from 'sequelize';
import db from '../database/db.js';
import User from './User.js';
import Group from './Group.js';

const Member = db.define('members', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'true',
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
        defaultValue: 1
    },
    status: {
        type: DataTypes.ENUM('Solicitud', 'Miembro'),
        defaultValue: 'Solicitud'
    }
}, {
    tableName: 'MEMBERS',
    timestamps: false
});

Member.belongsTo(User, { foreignKey: 'user_id' });
Member.belongsTo(Group, { foreignKey: 'group_id' });

export default Member;
