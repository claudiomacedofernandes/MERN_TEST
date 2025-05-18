import axios from 'axios';

const API_URL = 'http://localhost:3001/api/stats';

export interface Stats {
  photosAdded: number;
  photosDeleted: number;
  currentPhotos: number;
  usersAdded: number;
  usersDeleted: number;
  currentUsers: number;
  totalLogins: number;
  totalLogouts: number;
  totalLoggedInUsers: number;
  updatedAt: string;
}

export const getStats = async (): Promise<Stats> => {
  const res = await axios.get(
    API_URL,
    { withCredentials: true }
  );
  
  if (!res.data?.stats) {
    throw new Error(res.data.message || 'Unable to get stats');
  }

  return res.data.stats;
};