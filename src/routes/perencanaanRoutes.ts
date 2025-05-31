import express from 'express';
import { PerencanaanController } from '../controllers/PerencanaanController';

const router = express.Router();
const controller = new PerencanaanController();

router.get('/', controller.getAll);
router.get('/search', controller.search);
router.get('/amplifikasi', controller.getAllByAmplifikasi);
router.get('/getById/:id', controller.getById);

router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
