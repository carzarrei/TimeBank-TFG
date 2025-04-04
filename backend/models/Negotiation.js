import { DataTypes } from 'sequelize';
import db from '../database/db.js';

const Negotiation = db.define('negotiations', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    offer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Offer,
            key: 'id'
        }
    },
    request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Request,
            key: 'id'
        }
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
    negotiated_time: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'NEGOTIATIONS',
    timestamps: false
});

export default Negotiation;