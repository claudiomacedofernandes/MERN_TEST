import React from 'react';
import { logoutUser, updateUserRole, USER_ROLES } from '../api/auth.api';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import Register from './Register';

const User: React.FC = () => {
  const { userid, username, userrole, logout, updateRole } = useAuth();

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const selectedRole = e.target.value;
      const newRole = await updateUserRole(selectedRole);
      updateRole(newRole);
    } catch (err) {
      console.error('Role update failed:', err);
      alert('Failed to update role');
    }
  };

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      if (!res) {
        console.error('Logout incomplete');
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      logout();
    }
  };

  if (userid) {
    return (
      <div className="card max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
        <p className="mb-2">Welcome, <span className="font-medium">{username}</span>!</p>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Role:</label>
          <select
            value={userrole || ''}
            onChange={handleRoleChange}
            className="border rounded-md p-2 w-full"
          >
            {USER_ROLES.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="text-2xl font-semibold mb-4 text-center">Account</h2>
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <div className="card flex-1">
          <h3 className="text-xl font-medium mb-2">Login</h3>
          <Login />
        </div>
        <div className="card flex-1">
          <h3 className="text-xl font-medium mb-2">Register</h3>
          <Register />
        </div>
      </div>
    </div>
  );
};

export default User;