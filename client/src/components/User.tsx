import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import Register from './Register';

const User: React.FC = () => {
  const { userid, username, userrole, logout } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  if (userid) {
    return (
      <div>
        <h2>Welcome, {username}!</h2>
        <p>Role: {userrole ?? 'N/A'}</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setTab('login')} disabled={tab === 'login'}>
          Login
        </button>
        <button onClick={() => setTab('register')} disabled={tab === 'register'}>
          Register
        </button>
      </div>
      {tab === 'login' ? (
        <Login />
      ) : (
        <Register />
      )}
    </div>
  );
};

export default User;
