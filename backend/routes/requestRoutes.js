import express from 'express';
import { createRequest, getAllRequests, getOpenRequests, getUserRequests, getUserAcceptedRequests, getRequestById, updateRequest, acceptRequest, completeRequest, confirmRequest, reopenRequest} from '../controllers/requestController.js';
import verifyLogin from '../middlewares/CheckAuth.js';

const router = express.Router();

router.post('/', verifyLogin ,createRequest);
router.get('/', verifyLogin ,getOpenRequests);
router.get('/all', verifyLogin ,getAllRequests);
router.get('/my-requests', verifyLogin ,getUserRequests);
router.get('/my-requests/accepted', verifyLogin ,getUserAcceptedRequests);
router.get('/:id', verifyLogin ,getRequestById);
router.post('/:id', verifyLogin, updateRequest)
router.post('/:id/accept', verifyLogin, acceptRequest)
router.post('/:id/confirm', verifyLogin, confirmRequest)
router.post('/:id/complete', verifyLogin, completeRequest)
router.post('/:id/reopen', verifyLogin, reopenRequest)

export default router;
