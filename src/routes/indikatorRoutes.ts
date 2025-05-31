import express from 'express';
import { IndikatorController } from '../controllers/IndikatorController';
import { uploadEvidence } from '../middlewares/upload';

const router = express.Router();
const controller = new IndikatorController();

router.get('/', controller.getAll);

router.get('/search', controller.search);

router.get('/:id', controller.getById);

// router.post('/', controller.create);
router.put('/:id', controller.update);

router.delete('/:id/remove-evidence', async (req, res) => {
    await controller.removeEvidence(req, res);
});

router.delete('/:id', controller.delete);

router.post(
    '/:id/upload-evidence',
    uploadEvidence.array('evidence', 10),
    controller.uploadEvidence
);

export default router;
