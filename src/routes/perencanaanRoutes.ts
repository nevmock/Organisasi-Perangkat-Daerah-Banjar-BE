import express from 'express';
import { PerencanaanController } from '../controllers/PerencanaanController';

const router = express.Router();
const controller = new PerencanaanController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
