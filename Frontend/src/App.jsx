import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Navbar from './components/Navbar';
import { AuthContext } from './context/AuthContext';

const ProtectedLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
    <Navbar />
    {children}
  </div>
);

const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-medium text-gray-500 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={user ? <ProtectedLayout><Dashboard /></ProtectedLayout> : <Navigate to="/login" />} />
      <Route path="/projects" element={user ? <ProtectedLayout><Projects /></ProtectedLayout> : <Navigate to="/login" />} />
      <Route path="/projects/:id" element={user ? <ProtectedLayout><ProjectDetails /></ProtectedLayout> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
