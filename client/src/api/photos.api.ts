import axios from 'axios';

const API_URL = 'http://localhost:3001/api/photos';

export interface Photo {
    id: string;
    filename: string;
    path: string;
    userid: string;
    username: string;
    userrole: string;
    uploadedAt: string;
}

export const getPhotos = async (): Promise<Photo[]> => {
    const res = await axios.get(
        API_URL,
        { withCredentials: true }
    );

    if (!res.data?.photos) {
        throw new Error(res.data.message || 'Unable to get photos');
    }

    return res.data.photos;
};

export const putPhoto = async (formData: FormData): Promise<Photo> => {
    const res = await axios.post(
        `${API_URL}/upload`,
        formData,
        {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
        });

    if (!res.data?.photo) {
        throw new Error(res.data.message || 'Unable to put photo');
    }

    return res.data.photo;
};

export const deletePhoto = async (photoId: string): Promise<boolean> => {
    const res = await axios.delete(
        `${API_URL}/${photoId}`,
        { withCredentials: true }
    );

    if (!res) {
        throw new Error('Unable to delete photo');
    }

    return true;
};