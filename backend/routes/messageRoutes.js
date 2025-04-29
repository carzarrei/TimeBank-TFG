import express from 'express';
import { createMessage, getMessagesBetweenUsers, getReceivedMessages, getSentMessages } from '../controllers/messageController.js';
import verifyLogin from '../middlewares/CheckAuth.js';
const router = express.Router();

router.post('/', verifyLogin, createMessage);
router.get('/received', verifyLogin, getReceivedMessages);
router.get('/sent', verifyLogin, getSentMessages);

export default router;
