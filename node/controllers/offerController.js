import Offer from '../models/Offer.js';

export const createOffer = async (req, res) => {
  const { titulo, descripcion, tiempoIntercambio, creadorId } = req.body;

  try {
    const oferta = await Offer.create({
      titulo,
      descripcion,
      tiempoIntercambio,
      fechaPublicacion: new Date(),
      creadorId,
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
