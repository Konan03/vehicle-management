// src/routes/user.routes.ts

import { Router } from 'express';
import { listUsers } from '../controllers/user/userController';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

// Ruta para obtener todos los usuarios
router.get('/users', verifyToken, listUsers);

export default router;
