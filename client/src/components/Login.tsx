import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from '../api/auth.api';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [formusername, setFormUsername] = useState('');
  const [formpassword, setFormPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const { token, userid, username, userrole } = await loginUser({
        username: formusername,
        password: formpassword,
      });
      login(token, userid, username, userrole);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Username</label>
        <input
          type="text"
          value={formusername}
          onChange={(e) => setFormUsername(e.target.value)}
          className="border rounded-md p-2 w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={formpassword}
          onChange={(e) => setFormPassword(e.target.value)}
          className="border rounded-md p-2 w-full"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary w-full">
        Login
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export default Login;