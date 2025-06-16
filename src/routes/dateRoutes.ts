import express from 'express';
import { DateController } from '../controllers/DateController';
import { uploadEvidence } from '../middlewares/upload';
import { IndikatorController } from '../controllers/IndikatorController';

const router = express.Router();
const controller = new DateController();
const controller2 = new IndikatorController();

router.get('/', controller.getAll);
router.get('/search', controller.search);
router.get('/populated', controller.getAllByAmplifikasi);
router.get('/getById/:id', controller.getById);

router.post('/', controller.create);
router.put('/:id', controller.update);

router.delete('/:id/remove-evidence', async (req, res) => {
    await controller2.removeEvidence(req, res);
});

router.delete('/:id', controller.delete);

router.post(
    '/:id/dokumentasi',
    uploadEvidence.array('evidence', 10),
    controller2.uploadEvidence
);

export default router;
