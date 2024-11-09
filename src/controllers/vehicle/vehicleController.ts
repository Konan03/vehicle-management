import { Request, Response } from 'express';
import { db } from '../../db/firebaseConfig';
import { Vehicle } from '../../models/Vehicle';
import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos
import { calculateMaintenanceRecommendations } from '../../services/maintenanceCalculator';

// Controlador para agregar un vehículo al perfil del usuario
export const addVehicle = async (req: Request, res: Response) => {
  const user = res.locals.user;

  if (!user) {
    return res.status(401).send({ message: 'Usuario no autenticado' });
  }

  const { model, brand, year, mileage, changeOil, changeAirFilter, tireRotation, brakeRevision } = req.body;

  // Validar campos obligatorios
  if (!model || !brand || !year || typeof mileage !== 'number' ||
      typeof changeOil !== 'boolean' || typeof changeAirFilter !== 'boolean' ||
      typeof tireRotation !== 'boolean' || typeof brakeRevision !== 'boolean') {
    return res.status(400).send({ message: 'Todos los campos son requeridos y deben ser del tipo correcto' });
  }

  const newVehicle: Vehicle = {
    id: uuidv4(),
    model,
    brand,
    year,
    mileage,
    changeOil,
    changeAirFilter,
    tireRotation,
    brakeRevision,
    lastOilChangeMileage: changeOil ? mileage : 0,           
    lastAirFilterChangeMileage: changeAirFilter ? mileage : 0,
    lastTireRotationMileage: tireRotation ? mileage : 0,
    lastBrakeRevisionMileage: brakeRevision ? mileage : 0
  };

  try {
    await db.ref(`users/${user.uid}/vehicles/${newVehicle.id}`).set(newVehicle);
    console.log('Vehículo agregado exitosamente:', newVehicle);
    res.status(201).send({ message: 'Vehículo agregado con éxito', vehicle: newVehicle });
  } catch (error) {
    console.log('Error al agregar el vehículo:', error);
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

export const updateVehicleMileage = async (req: Request, res: Response) => {
  const { vehicleId } = req.params; // Obtiene el ID del vehículo desde los parámetros
  const { mileage } = req.body; // Obtiene el nuevo valor de kilometraje desde el cuerpo de la solicitud
  const userId = res.locals.user.uid; // ID del usuario autenticado

  if (typeof mileage !== 'number') {
    return res.status(400).send({ message: 'El kilometraje debe ser un número válido.' });
  }

  try {
    // Referencia al vehículo específico del usuario en Firebase
    const vehicleRef = db.ref(`users/${userId}/vehicles/${vehicleId}`);
    const vehicleSnapshot = await vehicleRef.once('value');

    // Verificar si el vehículo existe
    if (!vehicleSnapshot.exists()) {
      return res.status(404).send({ message: 'Vehículo no encontrado.' });
    }

    // Actualizar el kilometraje del vehículo
    await vehicleRef.update({ mileage });

    res.status(200).send({
      message: 'Kilometraje actualizado con éxito',
      mileage,
    });
  } catch (error) {
    res.status(500).send({ message: 'Error al actualizar el kilometraje', error });
  }
};

export const updateVehicle = async (userId: string, vehicleId: string, updates: any) => {
  const vehicleRef = db.ref(`users/${userId}/vehicles/${vehicleId}`);
  await vehicleRef.update(updates);
};