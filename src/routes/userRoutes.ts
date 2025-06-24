import express from 'express';
import { UserController } from '../controllers/UserController';

const router = express.Router();
const controller = new UserController()

router.get('/getUsersWithCount', controller.getUsersWithCounts)

export default router;