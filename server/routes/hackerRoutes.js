import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Dummy hacker data
const dummyHackers = [
  {
    id: 1,
    name: "Alex Chen",
    skills: ["React", "Node.js", "Python", "Machine Learning"],
    hackathon_experience: 8,
    bio: "Full-stack developer with a passion for AI and hackathons"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    skills: ["JavaScript", "React", "Blockchain", "Web3"],
    hackathon_experience: 12,
    bio: "Blockchain enthusiast and frontend specialist"
  },
  {
    id: 3,
    name: "Mike Rodriguez",
    skills: ["Python", "Django", "PostgreSQL", "DevOps"],
    hackathon_experience: 6,
    bio: "Backend developer focused on scalable applications"
  },
  {
    id: 4,
    name: "Emily Davis",
    skills: ["React", "TypeScript", "GraphQL", "AWS"],
    hackathon_experience: 10,
    bio: "Cloud-native developer with expertise in modern web technologies"
  },
  {
    id: 5,
    name: "David Kim",
    skills: ["Vue.js", "Go", "Docker", "Kubernetes"],
    hackathon_experience: 7,
    bio: "DevOps engineer and Go enthusiast"
  }
];

// GET /api/hackers (protected route)
router.get('/', authMiddleware, (req, res) => {
  res.json({
    message: 'Hackers retrieved successfully',
    hackers: dummyHackers
  });
});

export default router;
