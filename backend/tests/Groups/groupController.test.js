import * as groupController from '../../controllers/groupController.js';
import { Group, Member, User, Request } from '../../models/index.js';
import { expect } from '@jest/globals';

jest.mock('../../models/index.js');

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('groupController', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    jest.clearAllMocks();

    // Definir las funciones como jest.fn()
    Member.findByPk = jest.fn();
    Member.findAll = jest.fn();
    Group.findByPk = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAllGroups devuelve todos los grupos', async () => {
    const req = {};
    const res = mockResponse();
    const groups = [{ id: 1, name: 'Grupo A' }];
    Group.findAll.mockResolvedValue(groups);

    await groupController.getAllGroups(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(groups);
  });

  test('getGroupMembers devuelve los miembros del grupo', async () => {
    const req = { params: { id: '1' } };
    const res = mockResponse();

    const group = { id: 1 };
    Group.findByPk.mockResolvedValue(group);

    const members = [
      {
        user_id: '123',
        group_id: '1',
        accumulated_time: 10,
        status: 'Miembro',
        user: {
          id: '123',
          name: 'Usuario de prueba',
          email: 'test@example.com',
          location: 'Ciudad',
          birth_date: '2000-01-01',
          profile_picture: 'url_a_imagen',
          skills: ['skill1', 'skill2'],
        },
      },
    ];

    Member.findAll.mockResolvedValue(members);

    await groupController.getGroupMembers(req, res);

    // Espera la transformación del controlador: solo datos del usuario + accumulated_time
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      members.map((member) => ({
        id: member.user_id,
        name: member.user.name,
        email: member.user.email,
        location: member.user.location,
        birth_date: member.user.birth_date,
        profile_picture: member.user.profile_picture,
        skills: member.user.skills,
        accumulated_time: member.accumulated_time,
      }))
    );
  });

  test('requestJoinGroup envía solicitud para unirse', async () => {
    const req = { params: { id: '1' }, user: { id: '123' } };
    const res = mockResponse();

    Group.findByPk.mockResolvedValue({ id: '1' });

    const memberCreateMock = jest.spyOn(Member, 'create').mockResolvedValue({});

    await groupController.requestJoinGroup(req, res);

    expect(Group.findByPk).toHaveBeenCalledWith('1');
    expect(memberCreateMock).toHaveBeenCalledWith({
      user_id: '123',
      group_id: '1',
      accumulated_time: 1,
      status: 'Solicitud',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Solicitud de union enviada' });
  });

  test('Acepta la solicitud correctamente si usuario es admin y solicitud existe', async () => {
      const req = { params: { memberId: '1' }, user: { id: '123' } };
      const res = mockResponse();

      const member = {
        id: '1',
        group_id: '10',
        status: 'Solicitud',
        update: jest.fn().mockImplementation((values) => {
          Object.assign(member, values);
          return Promise.resolve(member);
        }),
        save: jest.fn().mockResolvedValue(member),
      };
      const group = {
        id: '10',
        name: 'Grupo de Prueba',
        admin_id: '123',
      };

      Member.findByPk.mockResolvedValue(member);
      Group.findByPk.mockResolvedValue(group);


      await groupController.acceptJoinRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Solicitud de union aceptada' });

      expect(Member.findByPk).toHaveBeenCalledWith('1');
      expect(Group.findByPk).toHaveBeenCalledWith('10');
      expect(member.update).toHaveBeenCalledWith({ status: 'Miembro' });
      expect(member.save).toHaveBeenCalled();
    });

    test('Devuelve 404 si no se encuentra la solicitud', async () => {
      const req = { params: { memberId: '1' }, user: { id: '123' } };
      const res = mockResponse();

      Member.findByPk.mockResolvedValue(null);

      await groupController.acceptJoinRequest(req, res);

      expect(Member.findByPk).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Solicitud no encontrada' });
    });

    test('Devuelve 404 si no se encuentra el grupo', async () => {
      const req = { params: { memberId: '1' }, user: { id: '123' } };
      const res = mockResponse();

      const member = { group_id: '10', status: 'Solicitud'};
      Member.findByPk.mockResolvedValue(member);
      Group.findByPk.mockResolvedValue(null);

      await groupController.acceptJoinRequest(req, res);

      expect(Group.findByPk).toHaveBeenCalledWith('10');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Grupo no encontrado' });
    });

    test('Devuelve 403 si el usuario no es admin del grupo', async () => {
      const req = { params: { memberId: '1' }, user: { id: '999' } };
      const res = mockResponse();

      const member = { group_id: '10', status: 'Solicitud' };
      const group = { admin_id: '123' };

      Member.findByPk.mockResolvedValue(member);
      Group.findByPk.mockResolvedValue(group);

      await groupController.acceptJoinRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'No tienes permiso para aceptar esta solicitud' });
    });

    test('Devuelve 400 si el usuario ya es miembro', async () => {
      const req = { params: { memberId: '1' }, user: { id: '123' } };
      const res = mockResponse();

      const member = { group_id: '10', status: 'Miembro' };
      const group = { admin_id: '123' };

      Member.findByPk.mockResolvedValue(member);
      Group.findByPk.mockResolvedValue(group);

      await groupController.acceptJoinRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'El usuario ya es miembro del grupo' });
    });

    test('Captura errores y devuelve 400', async () => {
      const req = { params: { memberId: '1' }, user: { id: '123' } };
      const res = mockResponse();

      Member.findByPk.mockRejectedValue(new Error('error inesperado'));

      await groupController.acceptJoinRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'error inesperado' });
    });

    test('rejectJoinRequest elimina la solicitud', async () => {
    const req = { params: { memberId: '1' }, user: { id: '123' } };
    const res = mockResponse();

    const member = { 
      id: '1',
      group_id: '10',
      status: 'Solicitud',
      destroy: jest.fn().mockResolvedValue(true)
    };
    const group = { id: '10', admin_id: '123' };

    Member.findByPk.mockResolvedValue(member);
    Group.findByPk.mockResolvedValue(group);

    await groupController.rejectJoinRequest(req, res);

    expect(Member.findByPk).toHaveBeenCalledWith('1');
    expect(Group.findByPk).toHaveBeenCalledWith('10');
    expect(member.destroy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Solicitud de union rechazada' });
  });

  test('leaveGroup permite a un usuario salir del grupo', async () => {
    const req = { params: { id: '10' }, user: { id: '123' } };
    const res = mockResponse();

    const member = {
      id: '1',
      group_id: '10',
      user_id: '123',
      status: 'Miembro',
      destroy: jest.fn().mockResolvedValue(true)
    };
    const group = { id: '10', admin_id: '123' };

    Group.findByPk.mockResolvedValue(group);
    Member.findOne.mockResolvedValue(member);

    await groupController.leaveGroup(req, res);

    expect(Group.findByPk).toHaveBeenCalledWith('10');
    expect(Member.findOne).toHaveBeenCalledWith({ where: { user_id: '123' } });
    expect(member.destroy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario eliminado del grupo' });
  });
  test('newGroupRequest crea una solicitud grupal exitosamente', async () => {
    // Mock de req y res
    const req = {
    params: { id: '10' },
    user: { id: '123' },
    body: {
      title: 'Título de prueba',
      description: 'Descripción de prueba',
      requestedTime: 5,
    },
    };
    const res = mockResponse();

    const date= new Date();
    // Mocks de modelos y función externa
    const group = { id: '10', name: 'Grupo de Prueba' };
    const member = { user_id: '123', group_id: '10', status: 'Miembro' };
    // Congelar la fecha para que coincida exactamente
    jest.useFakeTimers().setSystemTime(date);

    const requestMock = {title: req.body.title, description: req.body.description, requested_time: req.body.requestedTime, creator_id: '123', group_id: '10', publication_date: new Date(), status: 'Abierta' };

    Group.findByPk.mockResolvedValue(group);
    Member.findOne = jest.fn().mockResolvedValue(member);
    Request.create = jest.fn().mockResolvedValue(requestMock);

    // Ejecutar
    await groupController.newGroupRequest(req, res);

    expect(Group.findByPk).toHaveBeenCalledWith('10');
    expect(Member.findOne).toHaveBeenCalledWith({ where: { user_id: '123', group_id: '10' } });
    expect(Request.create).toHaveBeenCalledWith(requestMock);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ request: requestMock, message: 'Solicitud grupal creada con éxito' });

    // Limpieza si se usó __Rewire__
    groupController.__ResetDependency__ && groupController.__ResetDependency__('createGroupRequest');
  });

  test('newGroupRequest devuelve 404 si el grupo no existe', async () => {
    const req = {
    params: { id: '10' },
    user: { id: '123' },
    body: { title: 't', description: 'd', requestedTime: 1 },
    };
    const res = mockResponse();

    Group.findByPk.mockResolvedValue(null);

    await groupController.newGroupRequest(req, res);

    expect(Group.findByPk).toHaveBeenCalledWith('10');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Grupo no encontrado' });
  });

  test('newGroupRequest devuelve 404 si el usuario no es miembro del grupo', async () => {
    const req = {
    params: { id: '10' },
    user: { id: '123' },
    body: { title: 't', description: 'd', requestedTime: 1 },
    };
    const res = mockResponse();

    Group.findByPk.mockResolvedValue({ id: '10' });
    Member.findOne = jest.fn().mockResolvedValue(null);

    await groupController.newGroupRequest(req, res);

    expect(Member.findOne).toHaveBeenCalledWith({ where: { user_id: '123', group_id: '10' } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'El usuario no pertenece a este grupo' });
  });

  test('newGroupRequest captura errores y devuelve 400', async () => {
    const req = {
    params: { id: '10' },
    user: { id: '123' },
    body: { title: 't', description: 'd', requestedTime: 1 },
    };
    const res = mockResponse();

    Group.findByPk.mockRejectedValue(new Error('Error inesperado'));

    await groupController.newGroupRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error inesperado' });
  });
    test('getGroupJoinRequests devuelve las solicitudes si el usuario es admin', async () => {
      const req = { params: { id: '10' }, user: { id: '123' } };
      const res = mockResponse();

      const group = { id: '10', admin_id: '123' };
      const requests = [
        {
          id: '2',
          user_id: '456',
          group_id: '10',
          status: 'Solicitud', 
          user: {
            id: '456',
            name: 'Usuario de prueba',
          }
        },
        {
          id: '3',
          user_id: '789',
          group_id: '10',
          status: 'Solicitud',
          user: {
            id: '789',
            name: 'Otro Usuario',
          }
        }
      ];

      Group.findByPk.mockResolvedValue(group);
      Member.findAll.mockResolvedValue(requests);

      await groupController.getGroupJoinRequests(req, res);

      expect(Group.findByPk).toHaveBeenCalledWith('10');
      expect(Member.findAll).toHaveBeenCalledWith({
      where: { group_id: '10', status: 'Solicitud' },
      include: [
        {
          model: expect.any(Function), // User model
          attributes: ['id', 'name'],
        },
      ],
    });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(requests);

      // Limpieza si se usó __Rewire__
      groupController.__ResetDependency__ && groupController.__ResetDependency__('getAllJoinRequestUsersFromGroup');
    });

    test('getGroupJoinRequests devuelve 404 si el grupo no existe', async () => {
      const req = { params: { id: '10' }, user: { id: '123' } };
      const res = mockResponse();

      Group.findByPk.mockResolvedValue(null);

      await groupController.getGroupJoinRequests(req, res);

      expect(Group.findByPk).toHaveBeenCalledWith('10');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Grupo no encontrado' });
    });

    test('getGroupJoinRequests devuelve 403 si el usuario no es admin', async () => {
      const req = { params: { id: '10' }, user: { id: '999' } };
      const res = mockResponse();

      const group = { id: '10', admin_id: '123' };
      Group.findByPk.mockResolvedValue(group);

      await groupController.getGroupJoinRequests(req, res);

      expect(Group.findByPk).toHaveBeenCalledWith('10');
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'No tienes permiso para ver las solicitudes de unión' });
    });

    test('getGroupJoinRequests captura errores y devuelve 400', async () => {
      const req = { params: { id: '10' }, user: { id: '123' } };
      const res = mockResponse();

      Group.findByPk.mockRejectedValue(new Error('Error inesperado'));

      await groupController.getGroupJoinRequests(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error inesperado' });
  });
});
