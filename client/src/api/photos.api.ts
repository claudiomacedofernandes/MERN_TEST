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

export const getPhotos = async (token: string | null): Promise<Photo[]> => {
    const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.data) {
        throw new Error('Unable do get photos');
    }

    if (!res.data.photos) {
        throw new Error(res.data.message);
    }

    return res.data.photos;
};

export const putPhoto = async (token: string | null, formData: FormData | null): Promise<Photo> => {
    const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });

    if (!res.data) {
        throw new Error('Unable do put photo');
    }

    if (!res.data.photo) {
        throw new Error(res.data.message);
    }

    return res.data.photo;
};

export const deletePhoto = async (token: string | null, photoId: string | null, userId: string | null): Promise<boolean> => {
    const res = await axios.delete(`${API_URL}/${photoId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userid: userId }
    });

    if (!res) {
        throw new Error('Unable do delete photo');
    }

    return true;
};