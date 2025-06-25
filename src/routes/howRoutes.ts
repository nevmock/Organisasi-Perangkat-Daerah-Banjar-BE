import express from 'express';
import { HowController } from '../controllers/HowController';

const router = express.Router();
const controller = new HowController();

router.get('/', controller.getAll);
router.get('/search', controller.search);
router.get('/populated', controller.getAllByAmplifikasi);
router.get('/getById/:id', controller.getById);

router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

router.get('/summary', controller.getUserSummary);

router.get('/admin/:userId', controller.getAllByUserforSuperAdmin);
router.get('/admin/doDateDetails/:howId', controller.getDoDateDetailsByHowIdAdmin);

router.get('/dashboard/summary', controller.dashboardSummary); 
router.get('/dashboard/programSummary', controller.getProgramSummary);

export default router;
