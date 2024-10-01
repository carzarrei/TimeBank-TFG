import express from 'express';
import { registerUser, loginUser , getUserById, editUser} from '../controllers/userController.js';

const router = express.Router();

router.get('/:id', getUserById);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/edit/:id', editUser);

export default router;
