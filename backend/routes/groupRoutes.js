import express from 'express';
import { createGroup, getAllGroups, getGroupById, getGroupMembers, joinGroup, leaveGroup } from '../controllers/groupController.js';
import verifyLogin from '../middlewares/CheckAuth.js';

const router = express.Router();

router.post('/', verifyLogin, createGroup);
router.post('/:id/join', verifyLogin, joinGroup);
router.post('/:id/leave', verifyLogin, leaveGroup);
router.get('/', verifyLogin, getAllGroups);
router.get('/:id', verifyLogin, getGroupById);
router.get('/:id/members', verifyLogin, getGroupMembers);

export default router;