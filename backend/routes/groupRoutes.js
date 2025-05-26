import express from 'express';
import { createGroup, 
    getAllGroups, 
    getGroupById, 
    getGroupMembers, 
    requestJoinGroup, 
    acceptJoinRequest, 
    getGroupJoinRequests, 
    rejectJoinRequest, 
    leaveGroup, 
    getUserGroup,
    newGroupRequest,
    getOpenGroupRequests,
    getOpenGroupOffers,
    newGroupOffer
} from '../controllers/groupController.js';
import verifyLogin from '../middlewares/CheckAuth.js';

const router = express.Router();

router.post('/', verifyLogin, createGroup);
router.post('/:id/join', verifyLogin, requestJoinGroup);
router.post('/:memberId/accept', verifyLogin, acceptJoinRequest);
router.delete('/:memberId/reject', verifyLogin, rejectJoinRequest)
router.post('/:id/leave', verifyLogin, leaveGroup);
router.get('/', verifyLogin, getAllGroups);
router.get('/:id', verifyLogin, getGroupById);
router.get('/:id/members', verifyLogin, getGroupMembers);
router.get('/:id/joinRequests', verifyLogin, getGroupJoinRequests);
router.get('/:id/requests', verifyLogin, getOpenGroupRequests);
router.post('/:id/requests/new', verifyLogin, newGroupRequest);
router.get('/:id/offers', verifyLogin, getOpenGroupOffers);
router.post('/:id/offers/new', verifyLogin, newGroupOffer);
router.get('/user/group', verifyLogin, getUserGroup);

export default router;