import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberIdToAdd, setMemberIdToAdd] = useState('');

  const { user } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        api.get(`/tasks/project/${id}`),
        api.get('/projects'),
        api.get('/auth/users')
      ]);
      setTasks(tasksRes.data);
      setProject(projectsRes.data.find(p => p._id === id));
      setAllUsers(usersRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const openCreateTaskModal = () => {
    setIsEditingTask(false);
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setShowTaskModal(true);
  };

  const openEditTaskModal = (task) => {
    setIsEditingTask(true);
    setEditTaskId(task._id);
    setTitle(task.title);
    setDescription(task.description || '');
    setAssignedTo(task.assignedTo ? task.assignedTo._id : '');
    setShowTaskModal(true);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditingTask) {
        await api.put(`/tasks/${editTaskId}`, { title, description, assignedTo });
      } else {
        await api.post('/tasks/create', { title, description, project: id, assignedTo });
      }
      setShowTaskModal(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/add-member`, { userId: memberIdToAdd });
      setShowMemberModal(false);
      setMemberIdToAdd('');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/update/${taskId}`, { status: newStatus });
      fetchData(); 
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update task status or unauthorized');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Todo': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{project ? project.title : 'Project Tasks'}</h2>
          <p className="text-gray-500 mt-1">Team Members: {project ? project.members.map(m => m.name).join(', ') : 'Loading...'}</p>
        </div>
        {user?.role === 'Admin' && (
          <div className="space-x-3 flex">
            <button onClick={() => setShowMemberModal(true)} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition shadow">
              + Add Member
            </button>
            <button onClick={openCreateTaskModal} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition shadow">
              + New Task
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Title</th>
              <th className="p-4 font-semibold text-gray-600">Description</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Assigned To</th>
              {user?.role === 'Admin' && <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task._id} className="border-b border-gray-100 hover:bg-gray-50 transition group">
                <td className="p-4 font-medium text-gray-800">{task.title}</td>
                <td className="p-4 text-gray-600 text-sm">{task.description || '-'}</td>
                <td className="p-4">
                  <select 
                    value={task.status} 
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className={`border rounded-full px-3 py-1 text-sm font-medium outline-none cursor-pointer appearance-none ${getStatusColor(task.status)}`}
                  >
                    <option value="Todo" className="bg-white text-gray-800">Todo</option>
                    <option value="In Progress" className="bg-white text-gray-800">In Progress</option>
                    <option value="Completed" className="bg-white text-gray-800">Completed</option>
                  </select>
                </td>
                <td className="p-4 text-gray-600 text-sm">
                  {task.assignedTo?.name ? (
                    <span className="bg-gray-100 px-2 py-1 rounded-full">{task.assignedTo.name}</span>
                  ) : (
                    <span className="text-gray-400 italic">Unassigned</span>
                  )}
                </td>
                {user?.role === 'Admin' && (
                  <td className="p-4 text-right">
                    <div className="opacity-0 group-hover:opacity-100 transition space-x-2">
                      <button onClick={() => openEditTaskModal(task)} className="text-gray-400 hover:text-blue-600">✎ Edit</button>
                      <button onClick={() => handleDeleteTask(task._id)} className="text-gray-400 hover:text-red-600">🗑 Delete</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr><td colSpan={user?.role === 'Admin' ? 5 : 4} className="p-8 text-center text-gray-500">No tasks have been created in this project yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">{isEditingTask ? 'Edit Task' : 'Create Task'}</h3>
            <form onSubmit={handleTaskSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Task Title</label>
                <input 
                  type="text" required 
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300" 
                  value={title} onChange={e => setTitle(e.target.value)} 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Description</label>
                <textarea 
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300 min-h-[100px]" 
                  value={description} onChange={e => setDescription(e.target.value)} 
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-1">Assign To</label>
                <select 
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300 bg-white"
                  value={assignedTo} onChange={e => setAssignedTo(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {project?.members.map(member => (
                    <option key={member._id} value={member._id}>{member.name} ({member.email})</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowTaskModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                  {isEditingTask ? 'Save Changes' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Add Team Member</h3>
            <form onSubmit={handleAddMember}>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-1">Select User</label>
                <select 
                  required
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300 bg-white"
                  value={memberIdToAdd} onChange={e => setMemberIdToAdd(e.target.value)}
                >
                  <option value="" disabled>Select a user to add...</option>
                  {allUsers.filter(u => !project?.members.find(m => m._id === u._id)).map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-2">Only users not currently in the project are shown.</p>
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowMemberModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition">Cancel</button>
                <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
