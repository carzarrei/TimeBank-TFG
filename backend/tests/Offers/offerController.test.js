import * as offerController from '../../controllers/offerController.js';
import { exchangeTimeBetweenMembers } from '../../controllers/groupController.js';
import { exchangeTimeBetweenUsers } from '../../controllers/userController.js';
import db from '../../database/db.js';

// Mock the models before importing anything else
jest.mock('../../models/index.js', () => ({
  Offer: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
  Member: {
    findOne: jest.fn(),
    belongsTo: jest.fn(),
  },
  User: {
    findByPk: jest.fn(),
    belongsTo: jest.fn(),
  },
  Request: {
    belongsTo: jest.fn(),
  },
  Group: {
    belongsTo: jest.fn(),
  },
}));

jest.mock('../../controllers/groupController.js');
jest.mock('../../controllers/userController.js');
jest.mock('../../database/db.js');

// Import the mocked models after the mock is set up
const { Offer, Member } = require('../../models/index.js');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('offerController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOffer', () => {
    it('debería crear una oferta si los datos son válidos', async () => {
      const req = {
        body: { title: 'Oferta de ayuda', description: 'Descripción', offeredTime: 3 },
        user: { id: 1 },
      };
      const res = mockRes();
      const mockOffer = { id: 1, title: 'Oferta de ayuda', description: 'Descripción', offered_time: 3 };
      Offer.create.mockResolvedValue(mockOffer);

      await offerController.createOffer(req, res);

      expect(Offer.create).toHaveBeenCalledWith({
        title: 'Oferta de ayuda',
        description: 'Descripción',
        offered_time: 3,
        publication_date: expect.any(Date),
        creator_id: 1,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockOffer);
    });

    it('debería devolver 400 si hay un error al crear la oferta', async () => {
      const req = {
        body: { title: 'Oferta', description: 'Descripción', offeredTime: 3 },
        user: { id: 1 },
      };
      const res = mockRes();
      const error = new Error('Error de base de datos');
      Offer.create.mockRejectedValue(error);

      await offerController.createOffer(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error de base de datos' });
    });
  });

  describe('getAllOffers', () => {
    it('debería devolver todas las ofertas', async () => {
      const req = {};
      const res = mockRes();
      const mockOffers = [{ id: 1 }, { id: 2 }];
      Offer.findAll.mockResolvedValue(mockOffers);

      await offerController.getAllOffers(req, res);

      expect(Offer.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockOffers);
    });

    it('debería devolver 400 si hay un error', async () => {
      const req = {};
      const res = mockRes();
      const error = new Error('Error de base de datos');
      Offer.findAll.mockRejectedValue(error);

      await offerController.getAllOffers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error de base de datos' });
    });
  });

  describe('getOpenOffers', () => {
    it('debería devolver solo las ofertas abiertas', async () => {
      const req = {};
      const res = mockRes();
      const mockOffers = [{ id: 1, status: 'Abierta' }];
      Offer.findAll.mockResolvedValue(mockOffers);

      await offerController.getOpenOffers(req, res);

      expect(Offer.findAll).toHaveBeenCalledWith({ where: { status: 'Abierta' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockOffers);
    });
  });

  describe('getUserOffers', () => {
    it('debería devolver las ofertas del usuario autenticado', async () => {
      const req = { user: { id: 1 } };
      const res = mockRes();
      const mockOffers = [{ id: 1, creator_id: 1 }];
      Offer.findAll.mockResolvedValue(mockOffers);

      await offerController.getUserOffers(req, res);

      expect(Offer.findAll).toHaveBeenCalledWith({ where: { creator_id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockOffers);
    });
  });

  describe('getUserAcceptedOffers', () => {
    it('debería devolver las ofertas aceptadas por el usuario', async () => {
      const req = { user: { id: 1 } };
      const res = mockRes();
      const mockOffers = [{ id: 1, accepted_by: 1, status: 'Aceptada' }];
      Offer.findAll.mockResolvedValue(mockOffers);

      await offerController.getUserAcceptedOffers(req, res);

      expect(Offer.findAll).toHaveBeenCalledWith({ where: { accepted_by: 1, status: 'Aceptada' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockOffers);
    });
  });

  describe('getOfferById', () => {
    it('debería devolver la oferta si existe', async () => {
      const req = { params: { id: '5' } };
      const res = mockRes();
      const mockOffer = { id: 5, title: 'Oferta test' };
      Offer.findByPk.mockResolvedValue(mockOffer);

      await offerController.getOfferById(req, res);

      expect(Offer.findByPk).toHaveBeenCalledWith('5');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockOffer);
    });

    it('debería devolver 404 si no se encuentra la oferta', async () => {
      const req = { params: { id: '999' } };
      const res = mockRes();
      Offer.findByPk.mockResolvedValue(null);

      await offerController.getOfferById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Offer not found' });
    });
  });

  describe('updateOffer', () => {
    it('debería actualizar una oferta si el usuario es el creador y los datos son válidos', async () => {
      const req = {
        params: { id: '10' },
        body: { title: 'Título actualizado', description: 'Descripción actualizada', offeredTime: 5 },
        user: { id: 1 },
      };
      const res = mockRes();
      const mockOffer = {
        id: 10,
        creator_id: 1,
        save: jest.fn().mockResolvedValue(),
      };
      Offer.findByPk.mockResolvedValue(mockOffer);

      await offerController.updateOffer(req, res);

      expect(mockOffer.title).toBe('Título actualizado');
      expect(mockOffer.description).toBe('Descripción actualizada');
      expect(mockOffer.offered_time).toBe(5);
      expect(mockOffer.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Offer updated' });
    });

    it('debería devolver 403 si el usuario no es el creador', async () => {
      const req = {
        params: { id: '10' },
        body: { title: 'Título', description: 'Descripción', offeredTime: 5 },
        user: { id: 2 },
      };
      const res = mockRes();
      Offer.findByPk.mockResolvedValue({ creator_id: 1 });

      await offerController.updateOffer(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized to update this offer' });
    });
    it('debería devolver 404 si no se encuentra la oferta', async () => {
      const req = {
        params: { id: '999' },
        body: { title: 'Título', description: 'Descripción', offeredTime: 5 },
        user: { id: 1 },
      };
      const res = mockRes();
      Offer.findByPk.mockResolvedValue(null);

      await offerController.updateOffer(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Offer not found' });
    });
  });

  describe('acceptOffer', () => {
    it('debería aceptar una oferta si el usuario no es el creador', async () => {
      const req = { user: { id: 2 }, params: { id: '10' } };
      const res = mockRes();
      const mockOffer = {
        id: 10,
        creator_id: 1,
        group_id: null,
        update: jest.fn().mockResolvedValue(),
      };
      Offer.findByPk.mockResolvedValue(mockOffer);

      await offerController.acceptOffer(req, res);

      expect(mockOffer.update).toHaveBeenCalledWith({ accepted_by: 2, status: 'Aceptada' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Offer accepted' });
    });

    it('debería verificar pertenencia al grupo si la oferta es de grupo', async () => {
      const req = { user: { id: 2 }, params: { id: '10' } };
      const res = mockRes();
      const mockOffer = {
        id: 10,
        creator_id: 1,
        group_id: 5,
        update: jest.fn().mockResolvedValue(),
      };
      Offer.findByPk.mockResolvedValue(mockOffer);
      Member.findOne.mockResolvedValue({ id: 1, status: 'Miembro' });

      await offerController.acceptOffer(req, res);

      expect(Member.findOne).toHaveBeenCalledWith({ 
        where: { user_id: 2, group_id: 5, status: 'Miembro' } 
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('debería devolver 403 si el usuario no es miembro del grupo', async () => {
      const req = { user: { id: 2 }, params: { id: '10' } };
      const res = mockRes();
      const mockOffer = { creator_id: 1, group_id: 5 };
      Offer.findByPk.mockResolvedValue(mockOffer);
      Member.findOne.mockResolvedValue(null);

      await offerController.acceptOffer(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'No tienes permiso para aceptar esta solicitud' });
    });

    it('debería devolver 403 si el usuario intenta aceptar su propia oferta', async () => {
      const req = { user: { id: 1 }, params: { id: '10' } };
      const res = mockRes();
      Offer.findByPk.mockResolvedValue({ creator_id: 1 });

      await offerController.acceptOffer(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'You cannot accept your own offer' });
    });

    it('debería devolver 404 si no se encuentra la oferta', async () => {
      const req = { user: { id: 1 }, params: { id: '10' } };
      const res = mockRes();
      Offer.findByPk.mockResolvedValue(null);

      await offerController.acceptOffer(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Offer not found' });
    });
  });

  describe('completeOffer', () => {
    it('debería completar una oferta de usuario individual', async () => {
      const req = { user: { id: 1 }, params: { id: '10' } };
      const res = mockRes();
      const mockOffer = {
        id: 10,
        creator_id: 1,
        accepted_by: 2,
        offered_time: 3,
        group_id: null,
        update: jest.fn().mockResolvedValue(),
      };
      const mockTransaction = {};
      
      Offer.findByPk.mockResolvedValue(mockOffer);
      db.transaction.mockImplementation(async (callback) => {
        return await callback(mockTransaction);
      });
      exchangeTimeBetweenUsers.mockResolvedValue(true);

      await offerController.completeOffer(req, res);

      expect(exchangeTimeBetweenUsers).toHaveBeenCalledWith(1, 2, 3, mockTransaction);
      expect(mockOffer.update).toHaveBeenCalledWith(
        { accepted_by: null, status: 'Abierta' },
        { transaction: mockTransaction }
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('debería completar una oferta de grupo', async () => {
      const req = { user: { id: 1 }, params: { id: '10' } };
      const res = mockRes();
      const mockOffer = {
        id: 10,
        creator_id: 1,
        accepted_by: 2,
        offered_time: 3,
        group_id: 5,
        update: jest.fn().mockResolvedValue(),
      };
      const mockTransaction = {};
      
      Offer.findByPk.mockResolvedValue(mockOffer);
      db.transaction.mockImplementation(async (callback) => {
        return await callback(mockTransaction);
      });
      exchangeTimeBetweenMembers.mockResolvedValue(true);

      await offerController.completeOffer(req, res);

      expect(exchangeTimeBetweenMembers).toHaveBeenCalledWith(1, 2, 5, 3, mockTransaction);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('debería devolver 403 si el usuario no es el creador', async () => {
      const req = { user: { id: 2 }, params: { id: '10' } };
      const res = mockRes();
      Offer.findByPk.mockResolvedValue({ creator_id: 1 });

      await offerController.completeOffer(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized to confirm this offer' });
    });

    it('debería devolver 404 si no se encuentra la oferta', async () => {
      const req = { user: { id: 1 }, params: { id: '10' } };
      const res = mockRes();
      Offer.findByPk.mockResolvedValue(null);

      await offerController.completeOffer(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Offer not found' });
    });
  });

  describe('confirmOffer', () => {
    it('debería confirmar una oferta si el usuario la aceptó', async () => {
      const req = { user: { id: 1 }, params: { id: '10' } };
      const res = mockRes();
      const mockOffer = {
        id: 10,
        accepted_by: 1,
        update: jest.fn().mockResolvedValue(),
      };
      Offer.findByPk.mockResolvedValue(mockOffer);

      await offerController.confirmOffer(req, res);

      expect(mockOffer.update).toHaveBeenCalledWith({ status: 'Confirmada' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Offer confirmed' });
    });

    it('debería devolver 403 si el usuario no aceptó la oferta', async () => {
      const req = { user: { id: 2 }, params: { id: '10' } };
      const res = mockRes();
      Offer.findByPk.mockResolvedValue({ accepted_by: 1 });

      await offerController.confirmOffer(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized to confirm this offer' });
    });

    it('debería devolver 404 si no se encuentra la oferta', async () => {
      const req = { user: { id: 1 }, params: { id: '10' } };
      const res = mockRes();
      Offer.findByPk.mockResolvedValue(null);

      await offerController.confirmOffer(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Offer not found' });
    });
  });

  describe('cancelOffer', () => {
    it('debería cancelar una oferta si el usuario es el creador', async () => {
      const req = { user: { id: 1 }, params: { id: '10' } };
      const res = mockRes();
      const mockOffer = {
        id: 10,
        creator_id: 1,
        update: jest.fn().mockResolvedValue(),
      };
      Offer.findByPk.mockResolvedValue(mockOffer);

      await offerController.cancelOffer(req, res);

      expect(mockOffer.update).toHaveBeenCalledWith({ status: 'Cancelada' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Offer cancelled' });
    });

    it('debería devolver 403 si el usuario no es el creador', async () => {
      const req = { user: { id: 2 }, params: { id: '10' } };
      const res = mockRes();
      Offer.findByPk.mockResolvedValue({ creator_id: 1 });

      await offerController.cancelOffer(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized to cancel this offer' });
    });
  });

  describe('confirmCancelationOffer', () => {
    it('debería confirmar la cancelación si el usuario aceptó la oferta', async () => {
      const req = { user: { id: 1 }, params: { id: '10' } };
      const res = mockRes();
      const mockOffer = {
        id: 10,
        accepted_by: 1,
        update: jest.fn().mockResolvedValue(),
      };
      Offer.findByPk.mockResolvedValue(mockOffer);

      await offerController.confirmCancelationOffer(req, res);

      expect(mockOffer.update).toHaveBeenCalledWith({ accepted_by: null, status: 'Abierta' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Offer cancellation confirmed' });
    });

    it('debería devolver 403 si el usuario no aceptó la oferta', async () => {
      const req = { user: { id: 2 }, params: { id: '10' } };
      const res = mockRes();
      Offer.findByPk.mockResolvedValue({ accepted_by: 1 });

      await offerController.confirmCancelationOffer(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized to confirm this offer cancellation' });
    });
  });

  describe('reopenOffer', () => {
    it('debería reabrir una oferta cerrada si el usuario es el creador', async () => {
      const req = { user: { id: 1 }, params: { id: '10' } };
      const res = mockRes();
      const mockOffer = {
        id: 10,
        creator_id: 1,
        status: 'Cerrada',
        update: jest.fn().mockResolvedValue(),
      };
      Offer.findByPk.mockResolvedValue(mockOffer);

      await offerController.reopenOffer(req, res);

      expect(mockOffer.update).toHaveBeenCalledWith({ status: 'Abierta' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Offer reopened' });
    });

    it('debería devolver 400 si la oferta no está cerrada', async () => {
      const req = { user: { id: 1 }, params: { id: '10' } };
      const res = mockRes();
      Offer.findByPk.mockResolvedValue({ creator_id: 1, status: 'Abierta' });

      await offerController.reopenOffer(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Only cancelled offers can be reopened' });
    });

    it('debería devolver 403 si el usuario no es el creador', async () => {
      const req = { user: { id: 2 }, params: { id: '10' } };
      const res = mockRes();
      Offer.findByPk.mockResolvedValue({ creator_id: 1, status: 'Cerrada' });

      await offerController.reopenOffer(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized to reopen this offer' });
    });
  });

  describe('getGroupOffers', () => {
    it('debería devolver las ofertas abiertas de un grupo', async () => {
      const groupId = 5;
      const mockOffers = [{ id: 1, group_id: 5, status: 'Abierta' }];
      Offer.findAll.mockResolvedValue(mockOffers);

      const result = await offerController.getGroupOffers(groupId);

      expect(Offer.findAll).toHaveBeenCalledWith({
        where: { group_id: 5, status: 'Abierta' },
      });
      expect(result).toEqual(mockOffers);
    });

    it('debería manejar errores al obtener ofertas de grupo', async () => {
      const groupId = 5;
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      Offer.findAll.mockRejectedValue(new Error('Database error'));

      const result = await offerController.getGroupOffers(groupId);

      expect(consoleSpy).toHaveBeenCalledWith('Error getting offers by group:', 'Database error');
      expect(result).toBeUndefined();
      
      consoleSpy.mockRestore();
    });
  });

  describe('createGroupOffer', () => {
    it('debería crear una oferta de grupo', async () => {
      const offerData = {
        title: 'Oferta de grupo',
        description: 'Descripción',
        offeredTime: 4,
        creatorId: 1,
      };
      const groupId = 5;
      const mockOffer = { id: 1, ...offerData, group_id: groupId };
      Offer.create.mockResolvedValue(mockOffer);

      const result = await offerController.createGroupOffer(offerData, groupId);

      expect(Offer.create).toHaveBeenCalledWith({
        title: 'Oferta de grupo',
        description: 'Descripción',
        offered_time: 4,
        status: 'Abierta',
        publication_date: expect.any(Date),
        creator_id: 1,
        group_id: 5,
      });
      expect(result).toEqual(mockOffer);
    });

    it('debería manejar errores al crear oferta de grupo', async () => {
      const offerData = { title: 'Test', description: 'Test', offeredTime: 1, creatorId: 1 };
      const groupId = 5;
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      Offer.create.mockRejectedValue(new Error('Database error'));

      const result = await offerController.createGroupOffer(offerData, groupId);

      expect(consoleSpy).toHaveBeenCalledWith('Error creating group offer:', 'Database error');
      expect(result).toBeUndefined();
      
      consoleSpy.mockRestore();
    });
  });
});