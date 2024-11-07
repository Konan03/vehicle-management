// src/controllers/user/userController.ts

import { Request, Response } from 'express';
import { db } from '../../db/firebaseConfig';

export const listUsers = async (req: Request, res: Response) => {
  try {
    const usersRef = db.ref('users');
    const snapshot = await usersRef.once('value');

    if (!snapshot.exists()) {
      return res.status(404).send({ message: 'No se encontraron usuarios.' });
    }

    const users: any[] = [];
    snapshot.forEach((userSnapshot) => {
      users.push({ id: userSnapshot.key, ...userSnapshot.val() });
    });

    res.status(200).send({
      message: 'Listado de usuarios obtenido con éxito',
      users,
    });
  } catch (error) {
    res.status(500).send({ message: 'Error al obtener usuarios', error });
  }
};
