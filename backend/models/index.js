import User from './User.js';
import Group from './Group.js';
import Member from './Member.js';
import Request from './Request.js';
import Offer from './Offer.js';
import Message from './Message.js';

// Definir asociaciones después de importar los modelos

Member.belongsTo(User, { foreignKey: 'user_id' });
Member.belongsTo(Group, { foreignKey: 'group_id' });

Request.belongsTo(User, { foreignKey: 'creator_id', allowNull: true });
Request.belongsTo(Group, { foreignKey: 'group_id', allowNull: true });

Offer.belongsTo(User, { foreignKey: 'creator_id' });
Offer.belongsTo(Group, { foreignKey: 'group_id', allowNull: true });

Message.belongsTo(User, { as: 'sender', foreignKey: 'sender_id' });
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiver_id' });

export {
  User,
  Group,
  Member,
  Request,
  Offer,
  Message
};