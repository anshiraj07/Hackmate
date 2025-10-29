import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { listHackathons, createHackathon, enrollHackathon, myHackathonStats } from '../controllers/hackathonController.js';

const router = express.Router();

router.get('/', authMiddleware, listHackathons);
router.post('/', authMiddleware, createHackathon);
router.post('/enroll', authMiddleware, enrollHackathon);
router.get('/stats/me', authMiddleware, myHackathonStats);

export default router;


