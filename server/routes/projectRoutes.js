const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { 
  getManagerProjects, 
  getMyAllocations, 
  createProject, 
  updateProjectMeta,
  submitProject 
} = require('../controllers/projectController');

router.get('/manager-owned', protect, getManagerProjects);

router.get('/my-allocations', protect, getMyAllocations);


router.post('/', protect, createProject);


router.patch('/:projectId/review', protect, updateProjectMeta);


router.patch('/:projectId/submit', protect, submitProject);

module.exports = router;