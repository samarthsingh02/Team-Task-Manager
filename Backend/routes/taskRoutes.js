const express = require('express');
const router = express.Router();
const { createTask, getTasksByProject, updateTaskStatus } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/create', protect, admin, createTask);
router.get('/project/:id', protect, getTasksByProject);
router.patch('/update/:id', protect, updateTaskStatus);

module.exports = router;
