import express from 'express';
import { createMessage, getMessagesBetweenUsers } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', createMessage);
router.get('/:remitenteId/:destinatarioId', getMessagesBetweenUsers);

export default router;
