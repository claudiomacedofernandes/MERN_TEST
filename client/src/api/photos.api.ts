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
    var error = null;
    var data = null;
    try {
        const res = await axios.get(
            API_URL,
            { withCredentials: true }
        );

        if (!res.data?.photos) {
            error = 'Unable to get photos';
        } else {
            data = res.data.photos
        }
    } catch (err) {
        error = "Exception on API request";
    }

    if (error) {
        throw new Error(error);
    }

    return data;
};

export const putPhoto = async (formData: FormData): Promise<Photo> => {
    var error = null;
    var data = null;
    try {

        const res = await axios.post(
            `${API_URL}/upload`,
            formData,
            {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

        if (!res.data?.photo) {
            error = 'Unable to put photo';
        } else {
            data = res.data.photo;
        }
    } catch (err) {
        error = "Exception on API request";
    }

    if (error) {
        throw new Error(error);
    }

    return data;
};

export const deletePhoto = async (photoId: string): Promise<boolean> => {
    var error = null;
    try {
        const res = await axios.delete(
            `${API_URL}/${photoId}`,
            { withCredentials: true }
        );

        if (!res)
            error = 'Unable to delete photo';
    } catch (err) {
        error = "Exception on API request";
    }

    if (error) {
        throw new Error(error);
    }

    return true;
};