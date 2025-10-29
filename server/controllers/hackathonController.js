import Hackathon from '../models/Hackathon.js';
import HackathonEnrollment from '../models/HackathonEnrollment.js';

export const listHackathons = async (_req, res) => {
  try {
    const items = await Hackathon.find().sort({ createdAt: -1 });
    res.json({ hackathons: items });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch hackathons' });
  }
};

export const createHackathon = async (req, res) => {
  try {
    const { name, description, date, organizer } = req.body;
    if (!name || !description || !date || !organizer) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const hackathon = await Hackathon.create({
      name,
      description,
      date,
      organizer,
      createdBy: req.user.userId
    });
    res.status(201).json({ message: 'Hackathon created', hackathon });
  } catch (e) {
    res.status(500).json({ message: 'Failed to create hackathon' });
  }
};

export const enrollHackathon = async (req, res) => {
  try {
    const { hackathonId } = req.body;
    if (!hackathonId) return res.status(400).json({ message: 'hackathonId required' });
    const doc = await HackathonEnrollment.findOneAndUpdate(
      { hackathon: hackathonId, user: req.user.userId },
      { $setOnInsert: { hackathon: hackathonId, user: req.user.userId } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(201).json({ message: 'Enrolled', enrollment: doc });
  } catch (e) {
    if (e && e.code === 11000) {
      return res.status(200).json({ message: 'Already enrolled' });
    }
    res.status(500).json({ message: 'Failed to enroll', error: e?.message || 'unknown' });
  }
};

export const myHackathonStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const createdCount = await Hackathon.countDocuments({ createdBy: userId });
    const joinedCount = await HackathonEnrollment.countDocuments({ user: userId });
    res.json({ createdCount, joinedCount });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};


