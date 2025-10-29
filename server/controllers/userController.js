import User from '../models/User.js';

export const listUsersForTeammates = async (req, res) => {
  try {
    // exclude current user
    const users = await User.find({ _id: { $ne: req.user.userId } })
      .select('name email skills skillLevel createdAt');
    res.json({ users });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const updateSkills = async (req, res) => {
  try {
    const { skills = [], skillLevel } = req.body;
    const allowed = ['Beginner', 'Intermediate', 'Pro'];
    if (skillLevel && !allowed.includes(skillLevel)) {
      return res.status(400).json({ message: 'Invalid skill level' });
    }
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { skills, ...(skillLevel ? { skillLevel } : {}) },
      { new: true }
    ).select('name email skills skillLevel');
    res.json({ message: 'Profile updated', user });
  } catch (e) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// Connection request: requester -> receiver
import Connection from '../models/Connection.js';

export const sendConnectionRequest = async (req, res) => {
  try {
    const { toUserId } = req.body;
    if (!toUserId) return res.status(400).json({ message: 'toUserId required' });
    if (toUserId === req.user.userId) return res.status(400).json({ message: 'Cannot connect to yourself' });
    const doc = await Connection.findOneAndUpdate(
      { requester: req.user.userId, receiver: toUserId },
      { $setOnInsert: { requester: req.user.userId, receiver: toUserId, status: 'pending' } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(201).json({ message: 'Request sent', connection: doc });
  } catch (e) {
    if (e && e.code === 11000) {
      return res.status(200).json({ message: 'Request already exists' });
    }
    res.status(500).json({ message: 'Failed to send request', error: e?.message || 'unknown' });
  }
};

export const getMe = async (req, res) => {
  try {
    const me = await User.findById(req.user.userId).select('name email skills skillLevel');
    res.json({ user: me });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

export const listAllUsers = async (_req, res) => {
  try {
    const users = await User.find().select('name email skills skillLevel createdAt');
    res.json({ users });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const patchUpdateSkills = async (req, res) => {
  try {
    const { skills, skillLevel } = req.body;
    const update = {};
    if (Array.isArray(skills)) update.skills = skills;
    if (skillLevel) update.skillLevel = skillLevel;
    const user = await User.findByIdAndUpdate(req.user.userId, update, { new: true })
      .select('name email skills skillLevel');
    res.json({ message: 'Updated', user });
  } catch (e) {
    res.status(500).json({ message: 'Failed to update skills' });
  }
};

export const patchUpdateSkillLevel = async (req, res) => {
  try {
    const { skillLevel } = req.body;
    const allowed = ['Beginner', 'Intermediate', 'Pro'];
    if (!allowed.includes(skillLevel)) return res.status(400).json({ message: 'Invalid skill level' });
    const user = await User.findByIdAndUpdate(req.user.userId, { skillLevel }, { new: true })
      .select('name email skills skillLevel');
    res.json({ message: 'Level updated', user });
  } catch (e) {
    res.status(500).json({ message: 'Failed to update skill level' });
  }
};


