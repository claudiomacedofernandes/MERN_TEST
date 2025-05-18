import React, { useState, useEffect } from 'react';
import { getStats, Stats } from '../api/stats.api';
import moment from 'moment';

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError('Failed to load statistics');
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!stats) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Platform Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Photos Added</h2>
          <p>{stats.photosAdded}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Photos Deleted</h2>
          <p>{stats.photosDeleted}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Current Photos</h2>
          <p>{stats.currentPhotos}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Users Added</h2>
          <p>{stats.usersAdded}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Users Deleted</h2>
          <p>{stats.usersDeleted}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Current Users</h2>
          <p>{stats.currentUsers}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Logins</h2>
          <p>{stats.totalLogins}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Logouts</h2>
          <p>{stats.totalLogouts}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Logged In Users</h2>
          <p>{stats.totalLoggedInUsers}</p>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-4">
        Last updated: {moment(stats.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}
      </p>
    </div>
  );
};

export default Statistics;