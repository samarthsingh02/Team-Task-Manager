const Task = require('../models/Task');
const Project = require('../models/Project');

const getDashboardStats = async (req, res) => {
  try {
    let tasks;

    // Admins see stats for all tasks in their managed projects
    // Members see stats for tasks assigned to them
    if (req.user.role === 'Admin') {
      const projects = await Project.find({ admin: req.user._id });
      const projectIds = projects.map(p => p._id);
      tasks = await Task.find({ project: { $in: projectIds } });
    } else {
      tasks = await Task.find({ assignedTo: req.user._id });
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'Todo' || t.status === 'In Progress').length;
    
    const now = new Date();
    // Overdue tasks are those whose due date has passed and are not yet completed
    const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'Completed').length;

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
