const express = require('express');
const router = express.Router();
const { 
  createTask, 
  updateTaskStatus, 
  getProjectTasks 
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.post('/ai-suggest', protect, (req, res) => {
  const { taskTitle } = req.body;
  const suggestions = [
    `Initialize ${taskTitle} structure`,
    `Unit testing for ${taskTitle}`,
    `Deploy ${taskTitle} to staging`
  ];
  res.json({ suggestions });
});

router.post('/', protect, createTask);
router.get('/project/:projectId', protect, getProjectTasks);
router.patch('/:taskId/status', protect, updateTaskStatus);
router.get('/my-tasks', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;