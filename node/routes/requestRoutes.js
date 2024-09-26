import express from 'express';
import { createRequest, getAllRequests, getRequestById } from '../controllers/requestController.js';

const router = express.Router();

router.post('/', createRequest);
router.get('/', getAllRequests);
router.get('/:id', getRequestById);

export default router;
