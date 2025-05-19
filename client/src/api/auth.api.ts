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
  var error = null;
  var data = null;
  try {
    const res = await axios.post(
      `${API_URL}/login`,
      formData,
      { withCredentials: true }
    );

    if (!res.data?.user) {
      error = 'Login failed';
    } else {
      data = res.data.user;
    }
  } catch (err) {
    error = "Exception on API request";
  }

  if (error) {
    throw new Error(error);
  }

  return data;
};

export const registerUser = async (formData: AuthRequestForm): Promise<AuthResponse> => {
  var error = null;
  var data = null;
  try {
    const res = await axios.post(
      `${API_URL}/register`,
      formData,
      { withCredentials: true }
    );

    if (!res.data?.user) {
      error = 'Registration failed';
    } else {
      data = res.data.user;
    }

  } catch (err) {
    error = "Exception on API request";
  }

  if (error) {
    throw new Error(error);
  }

  return data;
};

export const updateUserRole = async (userrole: string | null): Promise<string> => {
  var error = null;
  var data = null;
  try {
    const res = await axios.put(
      `${API_URL}/update-role`,
      { role: userrole },
      { withCredentials: true }
    );

    if (!res.data?.user) {
      error = 'Unable to update the user role';
    } else {
      data = res.data.user.userrole;
    }
  } catch (err) {
    error = "Exception on API request";
  }

  if (error) {
    throw new Error(error);
  }

  return data;
};

export const logoutUser = async (): Promise<boolean> => {
  var error = null;
  try {
    await axios.get(
      `${API_URL}/logout`,
      { withCredentials: true }
    );
  } catch (err) {
    error = 'Logout failed';
  }

  if (error) {
    throw new Error(error);
  }

  return true;
};