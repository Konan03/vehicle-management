import { Router } from 'express';
import { addVehicle } from '../controllers/vehicle/vehicleController';
import { verifyToken } from '../middlewares/verifyToken';
import { getMaintenanceRecommendations } from '../controllers/maintenance/maintenanceController';
import { getVehicle } from '../controllers/vehicle/vehicleController';


const router = Router();

router.post('/add', verifyToken, addVehicle); // Ruta para agregar un vehículo
router.post('/:vehicleId/maintenance', verifyToken, getMaintenanceRecommendations);

router.get('/:vehicleId', verifyToken, getVehicle);
export default router;
