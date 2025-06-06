import { Sequelize, DataTypes } from 'sequelize';

describe('Group Model', () => {
    let sequelize;
    let Group;
    let User;

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false
        });

        // Mock User model for foreign key reference
        User = sequelize.define('users', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: DataTypes.STRING
        }, {
            tableName: 'USERS',
            timestamps: false
        });

        Group = sequelize.define('groups', {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            admin_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: User,
                    key: 'id',
                },
                allowNull: false,
            },
        }, {
            tableName: 'GROUPS',
            timestamps: false,
        });

        // Set up association
        Group.belongsTo(User, { foreignKey: 'admin_id' });

        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('Debe crear un grupo válido', async () => {
        const admin = await User.create({ name: 'Admin User' });

        const group = await Group.create({
            name: 'Grupo 1',
            admin_id: admin.id
        });

        expect(group.name).toBe('Grupo 1');
        expect(group.admin_id).toBe(admin.id);
    });

    test('Debe fallar si falta el nombre', async () => {
        const admin = await User.create({ name: 'Otro Admin' });

        await expect(Group.create({
            admin_id: admin.id
        })).rejects.toThrow();
    });

    test('Debe fallar si falta admin_id', async () => {
        await expect(Group.create({
            name: 'Grupo sin admin'
        })).rejects.toThrow();
    });

    test('Debe fallar si el nombre no es único', async () => {
        const admin = await User.create({ name: 'Admin Unico' });

        await Group.create({
            name: 'Grupo Unico',
            admin_id: admin.id
        });

        await expect(Group.create({
            name: 'Grupo Unico',
            admin_id: admin.id
        })).rejects.toThrow();
    });
});
