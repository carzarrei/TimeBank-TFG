import { Sequelize, DataTypes } from 'sequelize';

let sequelize, User, Message;

beforeAll(async () => {
  sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false
    });

  User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false },
  });

  Message = sequelize.define('Message', {
    subject: { type: DataTypes.STRING, allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });

  Message.belongsTo(User, { as: 'sender', foreignKey: { name: 'sender_id', allowNull: false } });
  Message.belongsTo(User, { as: 'receiver', foreignKey: { name: 'receiver_id', allowNull: false } });

  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Modelo Message', () => {
  let sender, receiver;

  beforeEach(async () => {
    await Message.destroy({ where: {} });
    await User.destroy({ where: {} });

    sender = await User.create({ email: 'sender@test.com' });
    receiver = await User.create({ email: 'receiver@test.com' });
  });

  it('debe crear un mensaje válido', async () => {
    const msg = await Message.create({
      subject: 'Hola',
      body: 'Mensaje de prueba',
      sender_id: sender.id,
      receiver_id: receiver.id,
    });

    expect(msg).toBeDefined();
    expect(msg.subject).toBe('Hola');
  });

  it('debe fallar si falta subject', async () => {
    await expect(
      Message.create({
        body: 'Sin asunto',
        sender_id: sender.id,
        receiver_id: receiver.id,
      })
    ).rejects.toThrow();
  });

  it('debe fallar si falta body', async () => {
    await expect(
      Message.create({
        subject: 'Asunto',
        sender_id: sender.id,
        receiver_id: receiver.id,
      })
    ).rejects.toThrow();
  });

  it('debe fallar si falta sender_id', async () => {
    await expect(
      Message.create({
        subject: 'Fallo',
        body: 'Falta remitente',
        receiver_id: receiver.id,
      })
    ).rejects.toThrow();
  });

  it('debe fallar si falta receiver_id', async () => {
    await expect(
      Message.create({
        subject: 'Fallo',
        body: 'Falta destinatario',
        sender_id: sender.id,
      })
    ).rejects.toThrow();
  });

  it('debe asociar correctamente con sender y receiver', async () => {
    const msg = await Message.create({
      subject: 'Hola',
      body: 'Mensaje con relaciones',
      sender_id: sender.id,
      receiver_id: receiver.id,
    });

    const foundMsg = await Message.findByPk(msg.id, {
      include: [
        { model: User, as: 'sender' },
        { model: User, as: 'receiver' }
      ]
    });

    expect(foundMsg.sender.email).toBe('sender@test.com');
    expect(foundMsg.receiver.email).toBe('receiver@test.com');
  });
});
