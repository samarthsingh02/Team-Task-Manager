import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold hover:text-blue-200 transition">Team Task Manager</Link>
        <div className="space-x-4 flex items-center">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/projects" className="hover:underline">Projects</Link>
          <span className="font-semibold ml-4 border-l pl-4 border-blue-400">
            {user?.name} <span className="text-sm font-normal text-blue-200">({user?.role})</span>
          </span>
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition ml-4">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
