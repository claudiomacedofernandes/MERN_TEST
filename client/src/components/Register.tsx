import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { registerUser } from '../api/auth.api';

const Register: React.FC<{
  onError: (error: string | null) => void;
}> = ({ onError }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '', role: 'guest' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onError(null);
      const { token, userid, username, userrole } = await registerUser(formData);
      login(token, userid, username, userrole);
    } catch (err) {
      onError('Registration failed:');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="border rounded-md p-2 w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="border rounded-md p-2 w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border rounded-md p-2 w-full"
        >
          <option value="guest">Guest</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="superadmin">SuperAdmin</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary w-full">
        Register
      </button>
    </form>
  );
};

export default Register;