import { Sequelize } from 'sequelize';

describe('User Model', () => {
  let sequelize;
  let User;

  beforeAll(async () => {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false
    });

    User = defineUserModelMock(sequelize);
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('Debe crear un usuario válido', async () => {
    const user = await User.create({
      name: 'Juan',
      email: 'juan@example.com',
      password: 'hashedpassword',
      location: 'Madrid',
      birth_date: '1990-01-01',
      profile_picture: 'juan.jpg',
      skills: 'Node.js,React',
      is_admin: false
    });

    expect(user.name).toBe('Juan');
    expect(user.email).toBe('juan@example.com');
    expect(user.accumulated_time).toBe(1);
    expect(user.profile_picture).toBe('juan.jpg');
    expect(user.skills).toBe('Node.js,React');
    expect(user.is_admin).toBe(false);
  });

  test('Debe fallar si falta un campo obligatorio', async () => {
    await expect(User.create({
      email: 'faltaNombre@example.com',
      password: '123456',
      location: 'Sevilla',
      birth_date: '1980-05-05'
    })).rejects.toThrow();
  });

  test('Debe aplicar valores por defecto correctamente', async () => {
    const user = await User.create({
      name: 'Pepe',
      email: 'pepe@example.com',
      password: 'pass',
      location: 'Barcelona',
      birth_date: '1988-03-03'
    });

     await user.reload();

    expect(user.accumulated_time).toBe(1);
    expect(user.profile_picture).toBe(null);
    expect(user.skills).toBe(null);
    expect(user.is_admin).toBe(null);
  });
});

function defineUserModelMock(sequelize) {
  return sequelize.define('users', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    birth_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    profile_picture: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    accumulated_time: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    skills: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    is_admin: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    reset_token: {
      type: Sequelize.STRING,
      allowNull: true
    },
    reset_token_expiry: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    tableName: 'USERS',
    timestamps: false,
  });
}
