
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

export interface AuthResponse {
  token: string;
  userid: string;
  username: string;
  userrole: string;
}

export interface AuthRequestForm {
  username: string;
  password: string;
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

