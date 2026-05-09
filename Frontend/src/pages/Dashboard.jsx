import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-600">Loading dashboard...</div>;

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={stats.totalTasks} colorClass="text-blue-600" />
        <StatCard title="Completed" value={stats.completedTasks} colorClass="text-green-600" />
        <StatCard title="Pending" value={stats.pendingTasks} colorClass="text-yellow-600" />
        <StatCard title="Overdue" value={stats.overdueTasks} colorClass="text-red-600" />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, colorClass }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className={`text-sm font-bold uppercase ${colorClass}`}>{title}</div>
    <div className="text-4xl font-extrabold text-gray-800 mt-2">{value}</div>
  </div>
);

export default Dashboard;
