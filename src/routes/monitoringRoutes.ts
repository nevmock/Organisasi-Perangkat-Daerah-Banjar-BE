import express from 'express';
import { MonitoringController } from '../controllers/monitoringController';

const router = express.Router();
const controller = new MonitoringController();

router.get('/summary', controller.getIndikatorSummary);
router.get('/:id', controller.getMonitoring);
router.get('/', controller.getAllMonitoring);

export default router;