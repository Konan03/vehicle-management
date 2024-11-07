// src/services/maintenanceService.ts

import { Maintenance } from '../models/Maintenance';

export const maintenanceTypes: Maintenance[] = [
  {
    type: "Cambio de aceite",
    interval: 5000,
    description: "Cambio de aceite para mantener el motor en buenas condiciones"
  },
  {
    type: "Cambio de filtro de aire",
    interval: 15000,
    description: "Sustitución del filtro de aire para una mejor eficiencia del motor"
  },
  {
    type: "Rotación de neumáticos",
    interval: 10000,
    description: "Rotación de neumáticos para un desgaste uniforme"
  },
  {
    type: "Revisión de frenos",
    interval: 20000,
    description: "Revisión y ajuste del sistema de frenos"
  },
  // Agrega otros tipos de mantenimiento aquí
];
