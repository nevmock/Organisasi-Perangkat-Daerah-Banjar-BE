import express from 'express';
import { IndikatorController } from '../controllers/IndikatorController';
import { uploadEvidence } from '../middlewares/upload';

const router = express.Router();
const controller = new IndikatorController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

// 👇 Tambahkan body { id_perencanaan } di upload
router.post(
    '/:id/upload-evidence',
    uploadEvidence.array('evidence', 10),
    controller.uploadEvidence
);

export default router;
