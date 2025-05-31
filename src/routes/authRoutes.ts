import express from 'express';
import AuthController from '../controllers/AuthController';

const router = express.Router();
const controller = new AuthController();

router.post('/register', async (req, res, next) => {
    try {
        await controller.registerUser(req, res);
    } catch (err) {
        next(err);
    }
});
router.post('/login', async (req, res, next) => {
    try {
        await controller.loginUser(req, res);
    } catch (err) {
        next(err);
    }
});

export default router;