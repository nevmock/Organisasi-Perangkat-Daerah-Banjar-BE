import express from 'express';
import { DateController } from '../controllers/DateController';

const router = express.Router();
const controller = new DateController();

router.get('/', controller.getAll);
router.get('/search', controller.search);
router.get('/popluted', controller.getAllByAmplifikasi);
router.get('/getById/:id', controller.getById);

router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
