// src/controllers/vehicle/maintenanceController.ts

import { Request, Response } from 'express';
import { calculateMaintenanceRecommendations } from '../../services/maintenanceCalculator';
import { getVehicleById, updateVehicle } from '../vehicle/vehicleController';
import { maintenanceTypes } from '../../services/maintenanceService';
import { db } from '../../db/firebaseConfig';

export const getMaintenanceRecommendations = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const userId = res.locals.user.uid; 

  // Obtener el vehículo por ID
  const vehicle = await getVehicleById(userId, vehicleId);
  if (!vehicle) {
    return res.status(404).send({ message: 'Vehículo no encontrado.' });
  }

  const updatedFields: Partial<typeof vehicle> = {};

  // Lógica para verificar y actualizar los estados booleanos
  if (vehicle.mileage - vehicle.lastOilChangeMileage >= 5000) {
    vehicle.changeOil = false;
    updatedFields.changeOil = false;
  }
  if (vehicle.mileage - vehicle.lastAirFilterChangeMileage >= 15000) {
    vehicle.changeAirFilter = false;
    updatedFields.changeAirFilter = false;
  }
  if (vehicle.mileage - vehicle.lastTireRotationMileage >= 10000) {
    vehicle.tireRotation = false;
    updatedFields.tireRotation = false;
  }
  if (vehicle.mileage - vehicle.lastBrakeRevisionMileage >= 20000) {
    vehicle.brakeRevision = false;
    updatedFields.brakeRevision = false;
  }

  // Si se ha actualizado algún campo, guarda los cambios en la base de datos
  if (Object.keys(updatedFields).length > 0) {
    await db.ref(`users/${userId}/vehicles/${vehicleId}`).update(updatedFields);
  }

  // Calcular las recomendaciones de mantenimiento
  const recommendations = calculateMaintenanceRecommendations(vehicle.mileage).filter(maintenance => {
    if (maintenance.type === "Cambio de aceite" && !vehicle.changeOil) return true;
    if (maintenance.type === "Cambio de filtro de aire" && !vehicle.changeAirFilter) return true;
    if (maintenance.type === "Rotación de neumáticos" && !vehicle.tireRotation) return true;
    if (maintenance.type === "Revisión de frenos" && !vehicle.brakeRevision) return true;
    return false;
  });

  const validate = recommendations.length > 0 ? "Si hay mantenimientos" : "No hay mantenimientos para hacer";

  res.status(200).send({
    message: 'Recomendaciones de mantenimiento obtenidas con éxito',
    validate,
    recommendations,
  });
};

export const updateMaintenanceStatus = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const userId = res.locals.user.uid;
  const { changeOil, changeAirFilter, tireRotation, brakeRevision } = req.body;

  // Obtener el vehículo por ID
  const vehicle = await getVehicleById(userId, vehicleId);
  if (!vehicle) {
    return res.status(404).send({ message: 'Vehículo no encontrado.' });
  }

  // Actualizar los estados y los kilometrajes iniciales según sea necesario
  const updates: any = {};
  if (changeOil === true) {
    updates.changeOil = true;
    updates.lastOilChangeMileage = vehicle.mileage;
  }
  if (changeAirFilter === true) {
    updates.changeAirFilter = true;
    updates.lastAirFilterChangeMileage = vehicle.mileage;
  }
  if (tireRotation === true) {
    updates.tireRotation = true;
    updates.lastTireRotationMileage = vehicle.mileage;
  }
  if (brakeRevision === true) {
    updates.brakeRevision = true;
    updates.lastBrakeRevisionMileage = vehicle.mileage;
  }

  try {
    // Actualizar el vehículo en la base de datos
    await updateVehicle(userId, vehicleId, updates)
    res.status(200).send({ message: 'Estado de mantenimiento actualizado correctamente', updates });
  } catch (error) {
    console.error('Error al actualizar el estado de mantenimiento:', error);
    res.status(500).send({ message: 'Error al actualizar el estado de mantenimiento', error });
  }
};

