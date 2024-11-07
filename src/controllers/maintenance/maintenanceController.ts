// src/controllers/vehicle/maintenanceController.ts

import { Request, Response } from 'express';
import { calculateMaintenanceRecommendations } from '../../services/maintenanceCalculator';
import { getVehicleById } from '../vehicle/vehicleController';

export const getMaintenanceRecommendations = async (req: Request, res: Response) => {
    const { vehicleId } = req.params;
    const userId = res.locals.user.uid; // Obtén el user ID desde `res.locals`

    // Obtener el vehículo por ID y extraer su kilometraje
    const vehicle = await getVehicleById(userId, vehicleId);
    if (!vehicle) {
      return res.status(404).send({ message: 'Vehículo no encontrado.' });
    }

    const { mileage } = vehicle; // Usar el kilometraje del vehículo encontrado

    // Calcular recomendaciones de mantenimiento
    const recommendations = calculateMaintenanceRecommendations(mileage);
    const validate = recommendations.length > 0 ? "Si hay mantenimientos" : "No hay mantenimientos para hacer";
  
    res.status(200).send({
      message: 'Recomendaciones de mantenimiento obtenidas con éxito',
      validate,
      recommendations,
    });
};
