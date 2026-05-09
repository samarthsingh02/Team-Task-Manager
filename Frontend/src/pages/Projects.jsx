import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setTitle('');
    setDescription('');
    setShowModal(true);
  };

  const openEditModal = (e, proj) => {
    e.preventDefault(); // prevent navigation
    setIsEditing(true);
    setEditId(proj._id);
    setTitle(proj.title);
    setDescription(proj.description || '');
    setShowModal(true);
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/projects/${editId}`, { title, description });
      } else {
        await api.post('/projects', { title, description });
      }
      setShowModal(false);
      setTitle('');
      setDescription('');
      fetchProjects();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Projects</h2>
        {user?.role === 'Admin' && (
          <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition shadow">
            + New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div key={proj._id} className="relative group">
            <Link to={`/projects/${proj._id}`} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md border transition block h-full">
              <h3 className="text-xl font-semibold mb-2 text-gray-800 pr-12">{proj.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{proj.description || 'No description provided.'}</p>
              <div className="text-sm font-medium text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded">
                {proj.members.length} {proj.members.length === 1 ? 'Member' : 'Members'}
              </div>
            </Link>
            {user?.role === 'Admin' && (
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                <button onClick={(e) => openEditModal(e, proj)} className="text-gray-400 hover:text-blue-600 bg-white rounded-full p-1 shadow-sm border">
                  ✎
                </button>
                <button onClick={(e) => handleDelete(e, proj._id)} className="text-gray-400 hover:text-red-600 bg-white rounded-full p-1 shadow-sm border">
                  🗑
                </button>
              </div>
            )}
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed">
            No projects found. {user?.role === 'Admin' && 'Create one to get started!'}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">{isEditing ? 'Edit Project' : 'Create Project'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Title</label>
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
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                  {isEditing ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
