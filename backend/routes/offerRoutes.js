import express from 'express';
import { createOffer, getAllOffers, getOfferById, acceptOffer, completeOffer, getOpenOffers} from '../controllers/offerController.js';
import verifyLogin from '../middlewares/verify.js';

const router = express.Router();

router.post('/:id/accept', verifyLogin, acceptOffer);
router.post('/:id/complete', verifyLogin, completeOffer);
router.post('/', verifyLogin, createOffer);
router.get('/', verifyLogin, getOpenOffers);
router.get('/:id', verifyLogin, getOfferById);



export default router;
