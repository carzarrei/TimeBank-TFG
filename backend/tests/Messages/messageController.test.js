// tests/Messages/messageController.test.js

import {
  createMessage,
  getMessagesBetweenUsers,
  getReceivedMessages,
  getSentMessages,
  getMessageById,
  deleteReceivedMessage,
  cancelSentMessage
} from '../../controllers/messageController.js';
import { Message } from '../../models/index.js';
import * as userController from '../../controllers/userController.js';

jest.mock('../../models/index.js');
jest.mock('../../controllers/userController.js');

describe('Message Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: 1 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('createMessage', () => {
    it('debería enviar un mensaje correctamente', async () => {
      userController.getUserByEmail.mockResolvedValue({ id: 2 });
      Message.create.mockResolvedValue({ id: 1 });

      req.body = {
        destinationEmail: 'test@example.com',
        subject: 'Hola',
        body: 'Contenido'
      };

      await createMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Mensaje enviado correctamente' }));
    });

    it('debería devolver error si el destinatario no existe', async () => {
      userController.getUserByEmail.mockResolvedValue(null);
      req.body.destinationEmail = 'desconocido@example.com';

      await createMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Destinatario no encontrado' });
    });

    it('debería devolver error si se intenta enviar a sí mismo', async () => {
      userController.getUserByEmail.mockResolvedValue({ id: 1 });
      req.body.destinationEmail = 'yo@example.com';

      await createMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'No puedes enviarte un mensaje a ti mismo' });
    });
  });

  describe('getMessagesBetweenUsers', () => {
    it('debería devolver los mensajes entre dos usuarios', async () => {
      req.params = { senderId: 1, receiverId: 2 };
      Message.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      await getMessagesBetweenUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
    });
  });

  describe('getReceivedMessages', () => {
    it('debería devolver los mensajes recibidos por el usuario', async () => {
      Message.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      await getReceivedMessages(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
    });
  });

  describe('getSentMessages', () => {
    it('debería devolver los mensajes enviados por el usuario', async () => {
      Message.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      await getSentMessages(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
    });
  });

  describe('getMessageById', () => {
    it('debería devolver el mensaje si el usuario es remitente o destinatario', async () => {
      Message.findOne.mockResolvedValue({ id: 1, sender_id: 1, receiver_id: 2 });
      req.params.id = 1;

      await getMessageById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    });

    it('debería devolver error si el mensaje no existe', async () => {
      Message.findOne.mockResolvedValue(null);
      req.params.id = 999;

      await getMessageById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Mensaje no encontrado' });
    });

    it('debería devolver error si el usuario no tiene permiso', async () => {
      Message.findOne.mockResolvedValue({ id: 1, sender_id: 2, receiver_id: 3 });
      req.params.id = 1;

      await getMessageById(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'No tienes permiso para ver este mensaje' });
    });
  });

  describe('deleteReceivedMessage', () => {
    it('debería eliminar el mensaje recibido', async () => {
      const destroy = jest.fn();
      Message.findOne.mockResolvedValue({ id: 1, receiver_id: 1, destroy });
      req.params.id = 1;

      await deleteReceivedMessage(req, res);

      expect(destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Mensaje eliminado correctamente' });
    });

    it('debería devolver error si el mensaje no existe', async () => {
      Message.findOne.mockResolvedValue(null);
      req.params.id = 999;

      await deleteReceivedMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Mensaje no encontrado' });
    });
  });

  describe('cancelSentMessage', () => {
    it('debería cancelar el mensaje enviado', async () => {
      const destroy = jest.fn();
      Message.findOne.mockResolvedValue({ id: 1, sender_id: 1, destroy });
      req.params.id = 1;

      await cancelSentMessage(req, res);

      expect(destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Mensaje cancelado correctamente' });
    });

    it('debería devolver error si el mensaje no existe', async () => {
      Message.findOne.mockResolvedValue(null);
      req.params.id = 999;

      await cancelSentMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Mensaje no encontrado' });
    });
  });
});
