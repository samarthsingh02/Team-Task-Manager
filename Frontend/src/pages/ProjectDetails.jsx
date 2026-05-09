import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useContext(AuthContext);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get(`/tasks/project/${id}`);
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks/create', { title, description, project: id });
      setShowModal(false);
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/update/${taskId}`, { status: newStatus });
      fetchTasks(); // Refresh list to ensure state sync
    } catch (error) {
      console.error(error);
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
        <h2 className="text-3xl font-bold text-gray-800">Project Tasks</h2>
        {user?.role === 'Admin' && (
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition shadow">
            + New Task
          </button>
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
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
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
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr><td colSpan="4" className="p-8 text-center text-gray-500">No tasks have been created in this project yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Create Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Task Title</label>
                <input 
                  type="text" required 
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300" 
                  value={title} onChange={e => setTitle(e.target.value)} 
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-1">Description</label>
                <textarea 
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300 min-h-[100px]" 
                  value={description} onChange={e => setDescription(e.target.value)} 
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
