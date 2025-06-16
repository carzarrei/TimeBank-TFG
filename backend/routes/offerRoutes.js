import express from 'express';
import { createOffer, getAllOffers, getOfferById, acceptOffer, completeOffer, getOpenOffers, getUserOffers, getUserAcceptedOffers, updateOffer, cancelOffer, confirmOffer, confirmCancelationOffer, reopenOffer } from '../controllers/offerController.js';
import verifyLogin from '../middlewares/CheckAuth.js';

const router = express.Router();

router.post('/', verifyLogin ,createOffer);
router.get('/', verifyLogin ,getOpenOffers);
router.get('/all', verifyLogin ,getAllOffers);
router.get('/my-offers', verifyLogin ,getUserOffers);
router.get('/my-offers/accepted', verifyLogin ,getUserAcceptedOffers);
router.get('/:id', verifyLogin ,getOfferById);
router.post('/:id', verifyLogin, updateOffer)
router.post('/:id/accept', verifyLogin, acceptOffer)
router.post('/:id/cancel', verifyLogin, cancelOffer)
router.post('/:id/confirm', verifyLogin, confirmOffer)
router.post('/:id/confirm-cancelation', verifyLogin, confirmCancelationOffer)
router.post('/:id/complete', verifyLogin, completeOffer)
router.post('/:id/reopen', verifyLogin, reopenOffer)



export default router;
