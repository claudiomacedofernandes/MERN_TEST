
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

interface AuthRequestForm {
  username: string;
  password: string;
  role: string;
}

export const loginUser = async (formData: AuthRequestForm): Promise<AuthResponse> => {
  const res = await axios.post(`${API_URL}/login`, formData);

  if (!res.data) {
    throw new Error('Login failed');
  }

  if (!res.data.user) {
    throw new Error(res.data.message);
  }

  return res.data.user;
};

export const registerUser = async (formData: AuthRequestForm): Promise<AuthResponse> => {
  const res = await axios.post(`${API_URL}/register`, formData);

  if (!res.data) {
    throw new Error('Registration failed');
  }

  if (!res.data.user) {
    throw new Error(res.data.message);
  }

  return res.data.user;
};

