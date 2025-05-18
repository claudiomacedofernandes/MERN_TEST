
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

// The user roles by Hierarchy
export const USER_ROLES = ['superadmin', 'admin', 'user', 'guest'];

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

export const updateUserRole = async (token: string | null, userid: string | null, userrole: string | null): Promise<string> => {
  const res = await axios.put(`${API_URL}/update-role`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { userid, role: userrole }
  });

  if (!res.data) {
    throw new Error('Unable to update the user role');
  }

  if (!res.data.user) {
    throw new Error(res.data.message);
  }

  return res.data.user.userrole;
};