import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useContext(AuthContext);

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

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { title, description });
      setShowModal(false);
      setTitle('');
      setDescription('');
      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Projects</h2>
        {user?.role === 'Admin' && (
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition shadow">
            + New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <Link key={proj._id} to={`/projects/${proj._id}`} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md border transition block">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{proj.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{proj.description || 'No description provided.'}</p>
            <div className="text-sm font-medium text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded">
              {proj.members.length} {proj.members.length === 1 ? 'Member' : 'Members'}
            </div>
          </Link>
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
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Create Project</h3>
            <form onSubmit={handleCreate}>
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
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
