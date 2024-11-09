import { Router } from 'express';
import { addVehicle, updateVehicleMileage } from '../controllers/vehicle/vehicleController';
import { verifyToken } from '../middlewares/verifyToken';
import { getMaintenanceRecommendations, updateMaintenanceStatus } from '../controllers/maintenance/maintenanceController';
import { getVehicle } from '../controllers/vehicle/vehicleController';


const router = Router();

router.post('/add', verifyToken, addVehicle); // Ruta para agregar un vehículo
router.post('/:vehicleId/maintenance', verifyToken, getMaintenanceRecommendations);

router.get('/:vehicleId', verifyToken, getVehicle);

router.put('/:vehicleId/mileage', verifyToken, updateVehicleMileage);
router.patch('/:vehicleId/updateMaintenance', verifyToken, updateMaintenanceStatus);
export default router;
