import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { listUsersForTeammates, updateSkills, sendConnectionRequest, getMe, listAllUsers, patchUpdateSkills, patchUpdateSkillLevel } from '../controllers/userController.js';

const router = express.Router();

router.get('/', authMiddleware, listUsersForTeammates);
router.put('/me/skills', authMiddleware, updateSkills);
router.post('/connections', authMiddleware, sendConnectionRequest);
router.get('/me', authMiddleware, getMe);
router.get('/all', authMiddleware, listAllUsers);
router.patch('/updateSkills', authMiddleware, patchUpdateSkills);
router.patch('/updateSkillLevel', authMiddleware, patchUpdateSkillLevel);

export default router;


