import express from 'express';
import { keepItAlive } from '../controllers/keep';

const router = express.Router();

router.get('/keep', keepItAlive);

export default router;
