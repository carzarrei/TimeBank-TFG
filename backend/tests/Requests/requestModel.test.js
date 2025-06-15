import { Sequelize, DataTypes } from 'sequelize';

describe('Request Model', () => {
    let sequelize;
    let User;
    let Group;
    let Request;

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false
        });

        // Mock User and Group models
        User = sequelize.define('users', {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name: DataTypes.STRING
        }, {
            tableName: 'USERS',
            timestamps: false
        });

        Group = sequelize.define('groups', {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name: DataTypes.STRING
        }, {
            tableName: 'GROUPS',
            timestamps: false
        });

        Request = sequelize.define('requests', {
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
            requested_time: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            publication_date: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            status: {
                type: DataTypes.ENUM('Abierta', 'Aceptada', 'Confirmada', 'Cancelada', 'Cerrada'),
                defaultValue: 'Abierta',
                validate: {
                  isIn: {
                    args: [['Abierta', 'Aceptada', 'Confirmada', 'Cancelada', 'Cerrada']],
                    msg: 'Estado inválido'
                  }
                }
            }            
        }, {
            tableName: 'REQUESTS',
            timestamps: false
        });

        Request.belongsTo(User, { foreignKey: 'creator_id' });
        Request.belongsTo(User, { foreignKey: 'accepted_by' });
        Request.belongsTo(Group, { foreignKey: 'group_id' });

        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('Debe crear una solicitud válida', async () => {
        const creator = await User.create({ name: 'Usuario Creador' });
        const group = await Group.create({ name: 'Grupo Test' });

        const request = await Request.create({
            creator_id: creator.id,
            group_id: group.id,
            title: 'Ayuda con mudanza',
            description: 'Necesito ayuda este sábado',
            requested_time: 3
        });

        expect(request.title).toBe('Ayuda con mudanza');
        expect(request.status).toBe('Abierta');
        expect(request.creator_id).toBe(creator.id);
        expect(request.group_id).toBe(group.id);
    });

    test('Debe fallar si falta creator_id', async () => {
        await expect(Request.create({
            title: 'Fallo sin creador',
            description: 'Debe fallar',
            requested_time: 2
        })).rejects.toThrow();
    });

    test('Debe fallar si falta título', async () => {
        const creator = await User.create({ name: 'Otro usuario' });

        await expect(Request.create({
            creator_id: creator.id,
            description: 'Sin título',
            requested_time: 1
        })).rejects.toThrow();
    });

    test('Debe fallar si el status es inválido', async () => {
        const creator = await User.create({ name: 'Usuario inválido' });

        await expect(Request.create({
            creator_id: creator.id,
            title: 'Título',
            description: 'Descripción',
            requested_time: 1,
            status: 'Inexistente'
        })).rejects.toThrow();
    });
});
