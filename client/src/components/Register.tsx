import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { registerUser } from '../api/auth';

const Register: React.FC = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ username: '', password: '', role: 'user' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { token, userid, username, userrole } = await registerUser(formData);
            login(token, userid, username, userrole);
        } catch (err) {
            console.error('Registration failed:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
