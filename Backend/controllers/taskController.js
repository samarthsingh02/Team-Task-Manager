const Task = require('../models/Task');
const Project = require('../models/Project');

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, project, assignedTo } = req.body;

    if (!title || !project) {
        return res.status(400).json({ message: 'Title and project are required' });
    }

    // Check if project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) return res.status(404).json({ message: 'Project not found' });

    // Validate assigned user is in the project
    if (assignedTo && !projectExists.members.includes(assignedTo)) {
      return res.status(400).json({ message: 'Assigned user is not a member of this project' });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      project,
      assignedTo,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasksByProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Check if user is part of the project
    if (req.user.role !== 'Admin' && !project.members.includes(req.user._id)) {
        return res.status(403).json({ message: 'Not authorized to view tasks for this project' });
    }

    const tasks = await Task.find({ project: req.params.id })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
      
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Validations for status
    const validStatuses = ['Todo', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid task status' });
    }

    // Role check: Admin or the user assigned to the task
    if (req.user.role !== 'Admin' && (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString())) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only admins can edit task details' });
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    if (status) task.status = status;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only admins can delete tasks' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, getTasksByProject, updateTaskStatus, editTask, deleteTask };
