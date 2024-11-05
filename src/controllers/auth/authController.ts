import { Request, Response } from 'express';
import { auth, db } from '../../db/firebaseConfig';
import { User } from '../../models/User';

// Función para registrar un usuario
export const registerUser = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
  
    // Validación de los datos de entrada
    if (!email || !password || !name) {
      return res.status(400).send({ message: 'Email, password y nombre son requeridos' });
    }
  
    try {
      // Crea el usuario en Firebase Authentication
      const userRecord = await auth.createUser({
        email,
        password
      });
  
      // Estructura los datos del usuario utilizando el modelo User
      const newUser: User = {
        uid: userRecord.uid,
        email: userRecord.email!,
        name: name,
        vehicles: [] // Inicia la lista de vehículos vacía
      };
  
      // Guarda la información del usuario en la base de datos de Firebase
      await db.ref(`users/${newUser.uid}`).set(newUser);
  
      res.status(201).send(newUser);
    } catch (error) {
      res.status(400).send({ message: 'Error al registrar usuario', error });
    }
  };
// Función para iniciar sesión de un usuario
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    // Validación de los datos de entrada
    if (!email || !password) {
      return res.status(400).send({ message: 'Email y password son requeridos' });
    }
  
    try {
      // Usa Firebase Auth para autenticar al usuario
      const user = await auth.getUserByEmail(email);
      if (user) {
        // Inicia sesión simulada con el email, ya que Firebase Admin no permite autenticación directa con contraseña
        // Retorna el token de ID y otros datos útiles del usuario
        const token = await auth.createCustomToken(user.uid);
        res.status(200).send({ uid: user.uid, email: user.email, token });
      }
    } catch (error) {
      res.status(400).send({ message: 'Error al iniciar sesión', error });
    }
  };
