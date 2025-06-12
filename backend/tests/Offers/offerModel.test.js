import { Sequelize, DataTypes } from 'sequelize';

describe('Offer Model', () => {
    let sequelize;
    let User;
    let Group;
    let Offer;

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

        Offer = sequelize.define('offers', {
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

        Offer.belongsTo(User, { foreignKey: 'creator_id' });
        Offer.belongsTo(User, { foreignKey: 'accepted_by' });
        Offer.belongsTo(Group, { foreignKey: 'group_id' });

        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('Debe crear una solicitud válida', async () => {
        const creator = await User.create({ name: 'Usuario Creador' });
        const group = await Group.create({ name: 'Grupo Test' });

        const offer = await Offer.create({
            creator_id: creator.id,
            group_id: group.id,
            title: 'Ayuda con mudanza',
            description: 'Necesito ayuda este sábado',
            offered_time: 3
        });

        expect(offer.title).toBe('Ayuda con mudanza');
        expect(offer.status).toBe('Abierta');
        expect(offer.creator_id).toBe(creator.id);
        expect(offer.group_id).toBe(group.id);
    });

    test('Debe fallar si falta creator_id', async () => {
        await expect(Offer.create({
            title: 'Fallo sin creador',
            description: 'Debe fallar',
            offered_time: 2
        })).rejects.toThrow();
    });

    test('Debe fallar si falta título', async () => {
        const creator = await User.create({ name: 'Otro usuario' });

        await expect(Offer.create({
            creator_id: creator.id,
            description: 'Sin título',
            offered_time: 1
        })).rejects.toThrow();
    });

    test('Debe fallar si el status es inválido', async () => {
        const creator = await User.create({ name: 'Usuario inválido' });

        await expect(Offer.create({
            creator_id: creator.id,
            title: 'Título',
            description: 'Descripción',
            offered_time: 1,
            status: 'Inexistente'
        })).rejects.toThrow();
    });
});
