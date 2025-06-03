import User from './User.js';
import Group from './Group.js';
import Member from './Member.js';

// Definir asociaciones después de importar los modelos

Member.belongsTo(User, { foreignKey: 'user_id' });
Member.belongsTo(Group, { foreignKey: 'group_id' });

export {
  User,
  Group,
  Member,
};