import express from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();


router.post('/register', UserController.registerUser);


router.post('/login', UserController.loginUser);

router.get('/', authMiddleware, UserController.getAllUsers);


router.get('/:id', authMiddleware, UserController.getUserById);

router.put('/:id', authMiddleware, UserController.updateUser);

router.delete('/:id', authMiddleware, UserController.deleteUser);

export default router; 