import db from '../database/db.js';
import Offer from '../models/Offer.js';
import { exchangeTimeBetweenUsers } from './userController.js';


export const createOffer = async (req, res) => {
  const { titulo, descripcion, tiempoIntercambio, creadorId } = req.body;
  const userId = req.user.id;
  try {
    const oferta = await Offer.create({
      titulo,
      descripcion,
      tiempoIntercambio,
      fechaPublicacion: new Date(),
      creadorId: userId,
    });
    res.status(201).json(oferta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllOffers = async (req, res) => {
  try {
    const ofertas = await Offer.findAll();
    res.status(200).json(ofertas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getOpenOffers = async (req, res) => {
  try {
    const ofertas = await Offer.findAll({ where: { estado: 'abierta' } });
    res.status(200).json(ofertas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getOfferById = async (req, res) => {
  const { id } = req.params;

  try {
    const oferta = await Offer.findByPk(id);
    if (!oferta) {
      return res.status(404).json({ message: 'Oferta no encontrada' });
    }
    res.status(200).json(oferta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const acceptOffer = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const oferta = await Offer.findByPk(id);
    if (!oferta) {
      return res.status(404).json({ message: 'Oferta no encontrada' });
    }
    await oferta.update({ aceptadaPor: userId, estado: 'aceptada' });
    res.status(200).json({ message: 'Oferta aceptada' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const completeOffer = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const oferta = await Offer.findByPk(id);
    if (!oferta) {
      return res.status(404).json({ message: 'Oferta no encontrada' });
    }
    const result = await db.transaction(async (t) => {
      await exchangeTimeBetweenUsers(userId, oferta.creadorId, oferta.tiempoIntercambio, t);
      await oferta.update({ aceptadaPor: null, estado: 'cerrada' }, { transaction: t });
    });
    res.status(200).json({result, message: 'Oferta completada' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
