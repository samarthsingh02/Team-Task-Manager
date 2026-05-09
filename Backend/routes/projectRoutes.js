const express = require('express');
const router = express.Router();
const { createProject, getProjects, addMember, updateProject, deleteProject } = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, createProject);
router.get('/', protect, getProjects);
router.post('/:id/add-member', protect, admin, addMember);
router.put('/:id', protect, admin, updateProject);
router.delete('/:id', protect, admin, deleteProject);

module.exports = router;
