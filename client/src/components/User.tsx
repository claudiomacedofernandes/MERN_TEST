import React, { useState } from 'react';
import { updateUserRole, USER_ROLES } from '../api/auth.api';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import Register from './Register';

const User: React.FC = () => {
  const { token, userid, username, userrole, logout, updateRole } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const selectedRole = e.target.value;
      const newRole = await updateUserRole(token, userid, selectedRole);
      updateRole(newRole);
    } catch (err) {
      console.error('Role update failed:', err);
      alert('Failed to update role');
    }
  };

  if (userid) {
    return (
      <div>
        <h2>Welcome, {username}!</h2>
        <p>Role: {userrole ? (
          <select
            value={userrole}
            onChange={handleRoleChange}
            className="border p-1 rounded"
          >
            {USER_ROLES.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        ) : 'N/A'}</p>
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
