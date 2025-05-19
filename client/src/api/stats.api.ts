import axios from 'axios';

const API_URL = `${process.env.REACT_APP_SERVER_API}/api/stats`;

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
  var error = null;
  var data = null;
  try {
    const res = await axios.get(
      API_URL,
      { withCredentials: true }
    );

    if (!res.data?.stats) {
      error = 'Unable to get stats';
    } else {
      data = res.data.stats;
    }
  } catch (err) {
    error = "Exception on API request";
  }

  if (error) {
    throw new Error(error);
  }

  return data;
};