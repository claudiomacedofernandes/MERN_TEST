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
  const res = await axios.post(
    `${API_URL}/login`,
    formData,
    { withCredentials: true }
  );

  if (!res.data?.user) {
    throw new Error(res.data.message || 'Login failed');
  }

  return res.data.user;
};

export const registerUser = async (formData: AuthRequestForm): Promise<AuthResponse> => {
  const res = await axios.post(
    `${API_URL}/register`,
    formData,
    { withCredentials: true }
  );

  if (!res.data?.user) {
    throw new Error(res.data.message || 'Registration failed');
  }

  return res.data.user;
};

export const updateUserRole = async (userrole: string | null): Promise<string> => {
  const res = await axios.put(
    `${API_URL}/update-role`,
    { role: userrole },
    { withCredentials: true }
  );

  if (!res.data?.user) {
    throw new Error(res.data.message || 'Unable to update the user role');
  }

  return res.data.user.userrole;
};