// src/services/maintenanceCalculator.ts

import { Maintenance } from '../models/Maintenance';
import { maintenanceTypes } from './maintenanceService';

export function calculateMaintenanceRecommendations(mileage: number): Maintenance[] {
  return maintenanceTypes.filter((maintenance) => mileage >= maintenance.interval);
}
