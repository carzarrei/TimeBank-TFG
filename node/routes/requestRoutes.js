import express from 'express';
import { createRequest, getAllRequests, getRequestById, acceptRequest, completeRequest} from '../controllers/requestController.js';
import verifyLogin from '../middlewares/verify.js';

const router = express.Router();

router.post('/', verifyLogin ,createRequest);
router.get('/', verifyLogin ,getAllRequests);
router.get('/:id', verifyLogin ,getRequestById);
router.post('/:id/accept', verifyLogin, acceptRequest)
router.post('/:id/complete', verifyLogin, completeRequest)

export default router;
