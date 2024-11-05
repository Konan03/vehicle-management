import express from 'express';
import * as dotenv from 'dotenv';
import authRoutes from '../src/routes/auth.routes' // Importa las rutas de autenticación
import { db } from './db/firebaseConfig'; // Asegura que la configuración de Firebase esté inicializada

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// Configurar las rutas
app.use('/api/auth', authRoutes); // Prefijo para rutas de autenticación

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
