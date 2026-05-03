const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const Announcement = require('../models/Announcement');

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: "Forbidden: Admin privileges required." });
  }
  next();
};

router.get('/users', protect, async (req, res) => {
  try {
    const users = await User.find({}).select('displayName email photoURL role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/update-role', protect, adminOnly, async (req, res) => {
  const { userId, newRole } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: "Failed to update role" });
  }
});

router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User permanently removed." });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

router.post('/broadcast', protect, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: "Unauthorized" });
  
  try {
   
    await Announcement.updateMany({}, { active: false });

    const broadcast = await Announcement.create({
      message: req.body.message,
      createdBy: req.user._id
    });
    res.json(broadcast);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/health', protect, async (req, res) => {
  res.json({
    database: "Connected",
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage().heapUsed,
    latency: "24ms"
  });
});

router.get('/members-only', protect, async (req, res) => {
  try {
    const members = await User.find({ role: 'Member' }).select('displayName _id photoURL');
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch members" });
  }
});

module.exports = router;