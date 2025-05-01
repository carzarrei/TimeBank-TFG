import express from 'express';
import { createRequest, getAllRequests, getRequestById, acceptRequest, completeRequest, confirmRequest} from '../controllers/requestController.js';
import verifyLogin from '../middlewares/CheckAuth.js';

const router = express.Router();

router.post('/', verifyLogin ,createRequest);
router.get('/', verifyLogin ,getAllRequests);
router.get('/:id', verifyLogin ,getRequestById);
router.post('/:id/accept', verifyLogin, acceptRequest)
router.post('/:id/confirm', verifyLogin, confirmRequest)
router.post('/:id/complete', verifyLogin, completeRequest)

export default router;
