import * as requestController from '../../controllers/requestController.js';
import { Request, User, Member, Group } from '../../models/index.js';

jest.mock('../../models/index.js');


const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('requestController', () => {
  describe('createRequest', () => {
    it('debería crear una solicitud si los datos son válidos', async () => {
      const req = {
        body: { title: 'Ayuda', description: 'Descripción', requestedTime: 2 },
        user: { id: 1 },
      };
      const res = mockRes();
      Request.create.mockResolvedValue({ id: 1, ...req.body });

      await requestController.createRequest(req, res);

      expect(Request.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ request: expect.any(Object), message: 'Solicitud creada' });
    });

    it('debería devolver 400 si faltan datos requeridos', async () => {
      const req = { body: {}, user: { id: 1 } };
      const res = mockRes();

      await requestController.createRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Faltan datos requeridos' });
    });
  });

  describe('getAllRequests', () => {
    it('debería devolver todas las solicitudes si el usuario es admin', async () => {
      const req = { user: { id: 1 } };
      const res = mockRes();
      User.findByPk.mockResolvedValue({ is_admin: true });
      Request.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      await requestController.getAllRequests(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
    });

    it('debería devolver 403 si el usuario no es admin', async () => {
      const req = { user: { id: 1 } };
      const res = mockRes();
      User.findByPk.mockResolvedValue({ is_admin: false });

      await requestController.getAllRequests(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'No tienes permiso para ver todas las solicitudes' });
    });
  });

  describe('getUserRequests', () => {
    it('debería devolver las solicitudes del usuario autenticado', async () => {
      const req = { user: { id: 1 } };
      const res = mockRes();
      Request.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      await requestController.getUserRequests(req, res);

      expect(Request.findAll).toHaveBeenCalledWith({ where: { creator_id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
    });
  });

  describe('getUserAcceptedRequests', () => {
    it('debería devolver las solicitudes aceptadas por el usuario', async () => {
      const req = { user: { id: 1 } };
      const res = mockRes();
      Request.findAll.mockResolvedValue([{ id: 1, status: 'Aceptada' }]);

      await requestController.getUserAcceptedRequests(req, res);

      expect(Request.findAll).toHaveBeenCalledWith({ where: { accepted_by: 1, status: 'Aceptada' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, status: 'Aceptada' }]);
    });
  });

  describe('getRequestById', () => {
    it('debería devolver la solicitud si existe y el usuario es miembro del grupo', async () => {
      const req = { user: { id: 1 }, params: { id: '5' } };
      const res = mockRes();
      Request.findByPk.mockResolvedValue({ id: 5, group_id: 10 });
      Member.findOne.mockResolvedValue({ id: 1 });

      await requestController.getRequestById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('debería devolver 403 si el usuario no es miembro del grupo', async () => {
      const req = { user: { id: 1 }, params: { id: '5' } };
      const res = mockRes();
      Request.findByPk.mockResolvedValue({ id: 5, group_id: 10 });
      Member.findOne.mockResolvedValue(null);

      await requestController.getRequestById(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'No tienes permiso para ver esta solicitud' });
    });

    it('debería devolver 404 si no se encuentra la solicitud', async () => {
      const req = { user: { id: 1 }, params: { id: '999' } };
      const res = mockRes();
      Request.findByPk.mockResolvedValue(null);

      await requestController.getRequestById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Solicitud no encontrada' });
    });
  });

  describe('acceptRequest', () => {
    it('debería aceptar una solicitud si está abierta', async () => {
      const req = { user: { id: 1 }, params: { id: '10' } };
      const res = mockRes();
      const mockRequest = {
        id: 10,
        status: 'Abierta',
        save: jest.fn(),
        update: jest.fn(function (fields) {
            Object.assign(this, fields);
            return Promise.resolve(this);
        }),
      };
      Request.findByPk.mockResolvedValue(mockRequest);

      await requestController.acceptRequest(req, res);

      expect(mockRequest.status).toBe('Aceptada');
      expect(mockRequest.accepted_by).toBe(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Solicitud aceptada' });
    });

    it('debería devolver 400 si la solicitud no está abierta', async () => {
      const req = { user: { id: 1 }, params: { id: '10' } };
      const res = mockRes();
      Request.findByPk.mockResolvedValue({ status: 'Cerrada' });

      await requestController.acceptRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Solo se pueden aceptar solicitudes abiertas' });
    });

    it('debería devolver 404 si la solicitud no existe', async () => {
      const req = { user: { id: 1 }, params: { id: '10' } };
      const res = mockRes();
      Request.findByPk.mockResolvedValue(null);

      await requestController.acceptRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Solicitud no encontrada' });
    });
  });

  describe('confirmRequest', () => {
    it('debería confirmar una solicitud si el usuario es el creador', async () => {
      const req = { user: { id: 1 }, params: { id: '10' } };
      const res = mockRes();
      const mockRequest = {
        id: 10,
        creator_id: 1,
        status: 'Aceptada',
        save: jest.fn(),
        update: jest.fn(function (fields) {
            Object.assign(this, fields);
            return Promise.resolve(this);
        }),
      };
      Request.findByPk.mockResolvedValue(mockRequest);

      await requestController.confirmRequest(req, res);

      expect(mockRequest.status).toBe('Confirmada');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Solicitud confirmada' });
    });

    it('debería devolver 403 si el usuario no es el creador', async () => {
      const req = { user: { id: 2 }, params: { id: '10' } };
      const res = mockRes();
      Request.findByPk.mockResolvedValue({ creator_id: 1 });

      await requestController.confirmRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'No tienes permiso para confirmar esta solicitud' });
    });

    it('debería devolver 404 si la solicitud no existe', async () => {
      const req = { user: { id: 1 }, params: { id: '10' } };
      const res = mockRes();
      Request.findByPk.mockResolvedValue(null);

      await requestController.confirmRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Solicitud no encontrada' });
    });
  });
});
