import { Request, Response } from 'express';
import { db } from '../../db/firebaseConfig';
import { Vehicle } from '../../models/Vehicle';
import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos

// Controlador para agregar un vehículo al perfil del usuario
export const addVehicle = async (req: Request, res: Response) => {
    const user = res.locals.user; // Esto debería funcionar sin problemas si `req.user` está correctamente tipado
  if (!user) {
    return res.status(401).send({ message: 'Usuario no autenticado' });
  }

  const { model, brand, year, mileage } = req.body;

  if (!model || !brand || !year || !mileage) {
    return res.status(400).send({ message: 'Todos los campos son requeridos' });
  }

  const newVehicle: Vehicle = {
    id: uuidv4(),
    model,
    brand,
    year,
    mileage
  };

  try {
    await db.ref(`users/${user.uid}/vehicles/${newVehicle.id}`).set(newVehicle);
    console.log('Vehículo agregado exitosamente:', newVehicle); // Log en español
    res.status(201).send({ message: 'Vehículo agregado con éxito', vehicle: newVehicle });
  } catch (error) {
    console.log('Error al agregar el vehículo:', error); // Log en español
    res.status(500).send({ message: 'Error al agregar el vehículo', error });
  }
};

export const getVehicleById = async (userId: string, vehicleId: string) => {
  try {
    console.log(`Buscando vehículo para userId: ${userId} y vehicleId: ${vehicleId}`);
    const vehicleRef = db.ref(`users/${userId}/vehicles/${vehicleId}`);
    const snapshot = await vehicleRef.once('value');
    if (snapshot.exists()) {
      console.log("Vehículo encontrado:", snapshot.val());
      return snapshot.val();
    } else {
      console.log("Vehículo no encontrado.");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el vehículo:", error);
    return null;
  }
};

export const getVehicle = async (req: Request, res: Response) => {
  const userId = res.locals.user.uid; // Usuario autenticado
  const { vehicleId } = req.params; // Vehicle ID en la URL

  try {
    const vehicle = await getVehicleById(userId, vehicleId);
    if (!vehicle) {
      return res.status(404).send({ message: 'Vehículo no encontrado.' });
    }
    res.status(200).send({
      message: 'Vehículo encontrado',
      vehicle
    });
  } catch (error) {
    res.status(500).send({ message: 'Error al obtener el vehículo.' });
  }
};
