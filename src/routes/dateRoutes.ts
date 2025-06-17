import express from 'express';
import { DateController } from '../controllers/DateController';
import { uploadDokumentasi } from '../middlewares/uploadMiddleware';
import { handleMulterError } from '../utils/multerErrorHandler';

const router = express.Router();
const controller = new DateController();

router.get('/', controller.getAll);
router.get('/search', controller.search);
router.get('/populated', controller.getAllByAmplifikasi);
router.get('/getById/:id', controller.getById);

router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

router.post('/:id/dokumentasi', (req, res, next) => {
  uploadDokumentasi(req, res, (err) => {
    if (err) {
      return handleMulterError(err, req, res, next);
    }
    controller.addDokumentasi(req, res, next);
  });
});

router.delete('/:id/dokumentasi', controller.deleteDokumentasi);

export default router;
