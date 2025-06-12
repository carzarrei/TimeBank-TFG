import db from '../database/db.js';
import { Member, Offer } from '../models/index.js';
import { exchangeTimeBetweenMembers } from './groupController.js';
import { exchangeTimeBetweenUsers } from './userController.js';

export const createOffer = async (req, res) => {
  const { title, description, offeredTime } = req.body;
  const userId = req.user.id;
  try {
    const offer = await Offer.create({
      title,
      description,
      offered_time: offeredTime,
      publication_date: new Date(),
      creator_id: userId,
    });
    res.status(201).json(offer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.findAll();
    res.status(200).json(offers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getOpenOffers = async (req, res) => {
  try {
    const openOffers = await Offer.findAll({ where: { status: 'Abierta' } });
    res.status(200).json(openOffers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserOffers = async (req, res) => {
  const userId = req.user.id;
  try {
    const userOffers = await Offer.findAll({ where: { creator_id: userId } });
    res.status(200).json(userOffers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getUserAcceptedOffers = async (req, res) => {
  const userId = req.user.id;
  try {
    const acceptedOffers = await Offer.findAll({ where: { accepted_by: userId, status: 'Aceptada' } });
    res.status(200).json(acceptedOffers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getOfferById = async (req, res) => {
  const { id } = req.params;

  try {
    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.status(200).json(offer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateOffer = async (req, res) => {
  const { id } = req.params;
  const { title, description, offeredTime } = req.body;
  const userId = req.user.id;
  try {
    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    if (offer.creator_id !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this offer' });
    }
    if (title !== undefined && title !== null && title !== '' && description !== undefined && description !== null && description !== '' && offeredTime !== undefined && offeredTime !== null) {      
    await offer.update({ title, description, offered_time: offeredTime });   
    } else {
      return res.status(400).json({ message: 'All fields are required' });
    }
    res.status(200).json({ message: 'Offer updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }   
};

export const acceptOffer = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    if (userId === offer.creator_id) {
      return res.status(403).json({ message: 'You cannot accept your own offer' });
    }
    if (offer.group_id) {
      const member = await Member.findOne({ where: { user_id: userId, group_id: offer.group_id, status: 'Miembro' } });
      if (!member) {
        return res.status(403).json({ message: 'No tienes permiso para aceptar esta solicitud' });
      }
    }
    await offer.update({ accepted_by: userId, status: 'Aceptada' });
    res.status(200).json({ message: 'Offer accepted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const completeOffer = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    if (offer.creator_id !== userId) {
      return res.status(403).json({ message: 'You are not authorized to confirm this offer' });
    }
    var result = null;
    if (offer.group_id === null) {
      result = await db.transaction(async (t) => {
        await exchangeTimeBetweenUsers(offer.creator_id, offer.accepted_by, offer.offered_time, t);
        await offer.update({ accepted_by: null, status: 'Abierta' }, { transaction: t });
      });
    } else {
      result = await db.transaction(async (t) => {
        await exchangeTimeBetweenMembers(offer.creator_id, offer.accepted_by, offer.group_id, offer.offered_time, t);
        await offer.update({ accepted_by: null, status: 'Abierta' }, { transaction: t });
      });
    } 
    if (result === null) {
      return res.status(400).json({ message: 'Error al completar la oferta' });
    } else {
      res.status(200).json({ result, message: 'Oferta completada' });
    }    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const confirmOffer = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    if (offer.accepted_by !== userId) {
      return res.status(403).json({ message: 'You are not authorized to confirm this offer' });
    } 
    await offer.update({ status: 'Confirmada' });
    res.status(200).json({ message: 'Offer confirmed' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const cancelOffer = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    if (offer.creator_id !== userId) {
      return res.status(403).json({ message: 'You are not authorized to cancel this offer' });
    }
    await offer.update({ status: 'Cancelada' });
    res.status(200).json({ message: 'Offer cancelled' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const confirmCancelationOffer = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    if (offer.accepted_by !== userId) {
      return res.status(403).json({ message: 'You are not authorized to confirm this offer cancellation' });
    }
    await offer.update({ accepted_by: null, status: 'Abierta' });
    res.status(200).json({ message: 'Offer cancellation confirmed' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const reopenOffer = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    if (offer.creator_id !== userId) {
      return res.status(403).json({ message: 'You are not authorized to reopen this offer' });
    }
    if (offer.status !== 'Cerrada') {
      return res.status(400).json({ message: 'Only cancelled offers can be reopened' });
    }
    await offer.update({ status: 'Abierta' });
    res.status(200).json({ message: 'Offer reopened' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const getGroupOffers = async (groupId) => {
  try {
    const offers = await Offer.findAll({
      where: { group_id: groupId, status: 'Abierta' },
    });
    return offers;
  } catch (error) {
    console.error('Error getting offers by group:', error.message);
  }
}

export const createGroupOffer = async (offerData, groupId) => {
  const { title, description, offeredTime, creatorId } = offerData;
  try {
    const offer = await Offer.create({
      title,
      description,
      offered_time: offeredTime,
      status: 'Abierta',
      publication_date: new Date(),
      creator_id: creatorId,
      group_id: groupId,
    });
    return offer;
  } catch (error) {
    console.error('Error creating group offer:', error.message);
  }
}
