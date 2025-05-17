import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';

interface UserProps {
  user: string | null;
  onUserChange: (username: string | null, role?: string) => void;
}

const User: React.FC<UserProps> = ({ user, onUserChange }) => {
  const [role, setRole] = useState<string | null>(null);
  const [tab, setTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) setRole(storedRole);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    onUserChange(null);
  };

  if (user) {
    return (
      <div>
        <h2>Welcome, {user}!</h2>
        <p>Role: {role ?? 'N/A'}</p>
        <button onClick={handleLogout}>Logout</button>
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
        <Login onLogin={(username, role) => onUserChange(username, role)} />
      ) : (
        <Register onRegister={(username, role) => onUserChange(username, role)} />
      )}
    </div>
  );
};

export default User;
