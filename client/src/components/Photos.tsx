import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES } from '../api/auth.api';
import { Photo, getPhotos, putPhoto, deletePhoto } from '../api/photos.api';

const Photos: React.FC = () => {
  const { userid, username, userrole, token } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch photos on mount
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const updatedPhotos = await getPhotos(token);
        setPhotos(updatedPhotos);
      } catch (err) {
        setError('Failed to load photos');
      }
    };
    fetchPhotos();
  }, [token]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle photo upload
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('user', JSON.stringify({
      userid,
      username,
      userrole
    }));

    try {
      const newPhoto = await putPhoto(token, formData);
      if (newPhoto)
        setPhotos([newPhoto, ...photos]);
      setFile(null);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to upload photo');
    }
  };

  // Handle photo deletion
  const handleDelete = async (photoId: string) => {
    try {
      const res = await deletePhoto(token, photoId, userid);
      if (res)
        setPhotos(photos.filter(photo => photo.id !== photoId));
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to delete photo');
    }
  };

  // Determine if delete button should be enabled
  // Server also checks if user can delete photo
  const canDeletePhoto = (photo: Photo) => {
    if (!userid || !userrole) return false;
    if (photo.username === username) return true; // Owner can delete
    const userRoleIndex = USER_ROLES.indexOf(userrole);
    const ownerRoleIndex = USER_ROLES.indexOf(photos.find(p => p.username === photo.username)?.userrole || 'user');
    return userRoleIndex < ownerRoleIndex; // Higher role (lower index) can delete
  };

  return (
    <div>
      <h1>Photos</h1>

      {/* Upload Button (Hidden for Guest, Disabled for No User) */}
      {userrole !== 'guest' && (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button
            onClick={handleUpload}
            disabled={!userid}
          >
            Upload Photo
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Photo Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
        {photos.map((photo) => (
          <div key={photo.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <img
              src={`http://localhost:3001${photo.path}`}
              alt={photo.filename}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <p>Uploaded by: {photo.username}</p>
            <p>Date: {new Date(photo.uploadedAt).toLocaleDateString()}</p>
            <button
              onClick={() => handleDelete(photo.id)}
              disabled={!canDeletePhoto(photo)}
              style={{ backgroundColor: canDeletePhoto(photo) ? 'red' : 'gray', color: 'white' }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Photos;