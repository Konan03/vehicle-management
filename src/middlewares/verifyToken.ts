import { Request, Response, NextFunction } from 'express';
import { auth } from '../db/firebaseConfig';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  console.log("Encabezado de autorización recibido:", authHeader); // Agrega este console.log

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("Token no proporcionado o formato incorrecto"); // Mensaje de error adicional
    return res.status(401).send({ message: 'Token de autenticación no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  console.log("Token extraído:", token); // Verifica el token extraído

  try {
    const decodedToken = await auth.verifyIdToken(token);
    console.log("Token decodificado correctamente:", decodedToken); // Verifica si el token se decodifica bien
    res.locals.user = decodedToken; // Almacena la información del usuario decodificada en la solicitud
    next();
  } catch (error) {
    console.log("Error al decodificar el token:", error); // Mensaje de error detallado
    res.status(401).send({ message: 'Token inválido o expirado' });
  }
};

