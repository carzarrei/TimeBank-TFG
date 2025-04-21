import express from 'express';
import { registerUser, loginUser , getUserById, editUser} from '../controllers/userController.js';
import verifyLogin from '../middlewares/CheckAuth.js';
const router = express.Router();

router.get('/:id', verifyLogin , getUserById);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/edit/:id', editUser);

export default router;
