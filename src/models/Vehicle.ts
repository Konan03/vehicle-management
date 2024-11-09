export interface Vehicle {
    id: string;          // ID único del vehículo
    model: string;      // Modelo del vehículo
    brand: string;       // Marca del vehículo
    year: number;        // Año del vehículo
    mileage: number; // Kilometraje actual del vehículo
    changeOil: boolean; //cambio de aceite
    changeAirFilter: boolean; //cambio filtro aire
    tireRotation: boolean; // rotacion de neumaticos
    brakeRevision: boolean; //revision de frenos
    lastOilChangeMileage: number;
    lastAirFilterChangeMileage: number;
    lastTireRotationMileage: number;
    lastBrakeRevisionMileage: number;
  }
  