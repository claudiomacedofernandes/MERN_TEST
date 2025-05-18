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
            const { token, userid, username, userrole } = await loginUser({ username: formusername, password: formpassword });
            login(token, userid, username, userrole);
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Username"
                value={formusername}
                onChange={(e) => setFormUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={formpassword}
                onChange={(e) => setFormPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default Login;