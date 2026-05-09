const express = require('express');
const router = express.Router();
const { createTask, getTasksByProject, updateTaskStatus, editTask, deleteTask } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/create', protect, admin, createTask);
router.get('/project/:id', protect, getTasksByProject);
router.patch('/update/:id', protect, updateTaskStatus);
router.put('/:id', protect, admin, editTask);
router.delete('/:id', protect, admin, deleteTask);

module.exports = router;
