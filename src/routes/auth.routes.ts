import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth/authController';
import { db } from '../db/firebaseConfig';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Ruta de prueba para verificar la conexión a Firebase
router.get('/test-connection', async (req, res) => {
    try {
      // Escribe un valor de prueba en la base de datos
      await db.ref('test').set({ message: 'Firebase connection successful!' });
      
      // Lee el valor de prueba de la base de datos
      const snapshot = await db.ref('test').once('value');
      const data = snapshot.val();
  
      res.status(200).send({ message: 'Connection to Firebase is successful', data });
    } catch (error) {
      res.status(500).send({ message: 'Failed to connect to Firebase', error });
    }
  });

export default router;
