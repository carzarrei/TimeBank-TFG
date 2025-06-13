import * as userController from '../../controllers/userController.js';
import {User} from '../../models/index.js';

jest.mock('../../models/index.js');

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 1 },
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('editUser', () => {
    it('debería actualizar el usuario y responder con 200', async () => {
      req.body = {
        name: 'Nuevo Nombre',
        email: 'nuevo@mail.com',
      };

      const mockUser = {
        update: jest.fn().mockResolvedValue(),
      };

      User.findByPk.mockResolvedValue(mockUser);
      User.findByPk.mockResolvedValueOnce(mockUser).mockResolvedValueOnce(mockUser); 
      // primero para buscar, luego para buscar actualizado

      await userController.editUser(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(mockUser.update).toHaveBeenCalledWith({
        name: 'Nuevo Nombre',
        email: 'nuevo@mail.com',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        user: mockUser,
        message: 'Usuario actualizado',
      }));
    });

    it('debería responder 404 si el usuario no existe', async () => {
      User.findByPk.mockResolvedValue(null);

      await userController.editUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
    });

    it('debería responder 400 en caso de error', async () => {
      User.findByPk.mockRejectedValue(new Error('DB error'));

      await userController.editUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "Error al editar el usuario" }));
    });
  });

  describe('getUserById', () => {
    it('debería devolver usuario si existe', async () => {
      const mockUser = { id: 1, name: 'Usuario' };
      req.params.id = 1;
      User.findByPk.mockResolvedValue(mockUser);

      await userController.getUserById(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('debería devolver 404 si no existe usuario', async () => {
      req.params.id = 99;
      User.findByPk.mockResolvedValue(null);

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
    });

    it('debería devolver 400 en caso de error', async () => {
      req.params.id = 1;
      User.findByPk.mockRejectedValue(new Error('DB error'));

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });
  });

  describe('deleteUser', () => {
    it('debería eliminar usuario y devolver mensaje', async () => {
      req.params.id = 1;
      const mockUser = { destroy: jest.fn().mockResolvedValue() };
      User.findByPk.mockResolvedValue(mockUser);

      await userController.deleteUser(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(mockUser.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuario eliminado' });
    });

    it('debería devolver 404 si no existe usuario', async () => {
      req.params.id = 99;
      User.findByPk.mockResolvedValue(null);

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
    });

    it('debería devolver 400 en caso de error', async () => {
      req.params.id = 1;
      User.findByPk.mockRejectedValue(new Error('DB error'));

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });
  });
});
