import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getStats, Stats } from '../api/stats.api';
import moment from 'moment';

const STATS_AUTO_REFRESH_INTERVAL = 30000;

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setError(null);
      const data = await getStats();
      setStats(data);
    } catch (err) {
      setError('Failed to load statistics');
    }
  };

  // Initial fetch and auto-refresh every STATS_AUTO_REFRESH_INTERVAL seconds
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, STATS_AUTO_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <p className="text-red-500 text-sm sm:ml-auto w-full sm:w-auto text-left sm:text-right">
        {error}
      </p>
    );
  }

  if (!stats) {
    return <p>Loading...</p>;
  }

  // Chart data
  const chartData = {
    labels: [
      'Photos Added',
      'Photos Deleted',
      'Current Photos',
      'Users Added',
      'Users Deleted',
      'Current Users',
      'Total Logins',
      'Total Logouts',
      'Logged In Users',
    ],
    datasets: [
      {
        label: 'Statistics',
        data: [
          stats.photosAdded,
          stats.photosDeleted,
          stats.currentPhotos,
          stats.usersAdded,
          stats.usersDeleted,
          stats.currentUsers,
          stats.totalLogins,
          stats.totalLogouts,
          stats.totalLoggedInUsers,
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      title: { display: true, text: 'Platform Statistics', font: { size: 20 } },
    },
    scales: {
      x: {
        title: { display: true, text: 'Statistic' },
        ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 },
      },
      y: {
        title: { display: true, text: 'Count' },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="card">
      <div className="h-96">
        <Bar data={chartData} options={chartOptions} />
      </div>
      <p className="text-sm text-gray-600 mt-4">
        Last updated: {moment(stats.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}
      </p>
    </div>
  );
};

export default Statistics;