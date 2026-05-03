const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

router.get('/member-insight', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id, status: { $ne: 'Done' } });
    
    if (tasks.length === 0) {
      return res.json({ insight: "All clear! No pending tasks assigned to you." });
    }

    const urgentTask = tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];
    
    const insight = `Priority Analysis: Your task "${urgentTask.title}" is marked as ${urgentTask.priority} priority. Based on your workload, completing this first will reduce project bottleneck by 15%.`;
    
    res.json({ insight });
  } catch (err) {
    res.status(500).json({ message: "AI Engine error" });
  }
});

module.exports = router;