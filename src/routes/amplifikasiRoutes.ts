import express from 'express';
import { AmplifikasiController } from '../controllers/AmplifikasiController';
import { uploadAmplifikasiEvidence, uploadAmplifikasiThumbnail } from '../middlewares/upload';

const router = express.Router();
const controller = new AmplifikasiController();

router.get('/', controller.getAll);
router.get('/search', controller.search);

router.get('/:id', controller.getById);
router.put('/:id', controller.update);

router.delete('/:id/remove-evidence', async (req, res) => {
    await controller.removeEvidence(req, res);
});

router.delete('/:id', controller.delete);

router.post(
    '/:id/upload-evidence',
    uploadAmplifikasiEvidence.array('evidence', 10),
    controller.uploadEvidence
);

router.post(
    '/:id/upload-thumbnail',
    uploadAmplifikasiThumbnail.array('thumbnail', 1),
    controller.uploadThumbnail
);


export default router;
