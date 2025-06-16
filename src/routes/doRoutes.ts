import express from 'express';
import { DoController } from '../controllers/DoController';
import { uploadDokumentasi } from '../middlewares/uploadMiddleware';

const router = express.Router();
const controller = new DoController();

router.get('/', controller.getAll);
router.get('/search', controller.search);
router.get('/populated', controller.getAllByAmplifikasi);
router.get('/getById/:id', controller.getById);

router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

router.post('/:id/dokumentasi', uploadDokumentasi, controller.addDokumentasi);

export default router;
