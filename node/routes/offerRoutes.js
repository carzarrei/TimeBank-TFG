import express from 'express';
import { createOffer, getAllOffers, getOfferById } from '../controllers/offerController.js';

const router = express.Router();

router.post('/', createOffer);
router.get('/', getAllOffers);
router.get('/:id', getOfferById);

export default router;
