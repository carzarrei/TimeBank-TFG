import express from 'express';
import { registerUser, loginUser , getUserById, editUser} from '../controllers/userController.js';
import verifyLogin from '../middlewares/CheckAuth.js';
const router = express.Router();
import upload from '../middlewares/upload.js';

router.get('/:id', verifyLogin , getUserById);
router.post('/register', upload.single('profilePicture'), registerUser);
router.post('/login', loginUser);
router.post('/edit/:id', editUser);
router.post('/edit-profile', verifyLogin, upload.none(), editUser);

export default router;
