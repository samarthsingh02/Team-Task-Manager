const express = require('express');
const router = express.Router();
const { createProject, getProjects, addMember } = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getProjects)
  .post(protect, admin, createProject);

router.route('/:id/add-member')
  .post(protect, admin, addMember);

module.exports = router;
