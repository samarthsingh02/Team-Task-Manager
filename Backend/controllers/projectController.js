const Project = require('../models/Project');
const User = require('../models/User');

const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Project title is required' });
    }

    const project = await Project.create({
      title,
      description,
      admin: req.user._id,
      members: [req.user._id], // The admin is automatically added as a member
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === 'Admin') {
      // Admins can see the projects they manage
      projects = await Project.find({ admin: req.user._id })
        .populate('members', 'name email')
        .populate('admin', 'name email');
    } else {
      // Members can only see projects they are assigned to
      projects = await Project.find({ members: req.user._id })
        .populate('members', 'name email')
        .populate('admin', 'name email');
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Ensure the current user is the admin of the project
    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add members to this project' });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }

    const userToAdd = await User.findById(userId);
    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found' });
    }

    project.members.push(userId);
    await project.save();

    res.json({ message: 'Member added successfully', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.admin.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    project.title = title || project.title;
    project.description = description || project.description;
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.admin.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProject, getProjects, addMember, updateProject, deleteProject };
