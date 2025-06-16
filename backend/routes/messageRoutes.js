import express from 'express';
import { createMessage, getMessagesBetweenUsers, getMessageById, getReceivedMessages, getSentMessages, deleteReceivedMessage, cancelSentMessage } from '../controllers/messageController.js';
import verifyLogin from '../middlewares/CheckAuth.js';
const router = express.Router();

router.post('/', verifyLogin, createMessage);
router.get('/received', verifyLogin, getReceivedMessages);
router.get('/sent', verifyLogin, getSentMessages);
router.get('/:id', verifyLogin, getMessageById);
router.delete('/received/:id', verifyLogin, deleteReceivedMessage);
router.delete('/sent/:id', verifyLogin, cancelSentMessage);

export default router;
