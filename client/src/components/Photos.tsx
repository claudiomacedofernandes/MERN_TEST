import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES } from '../api/auth.api';
import { Photo, getPhotos, putPhoto, deletePhoto } from '../api/photos.api';

const Photos: React.FC = () => {
  const { userid, username, userrole } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch photos on mount
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const updatedPhotos = await getPhotos();
        setPhotos(updatedPhotos);
      } catch (err) {
        setError('Failed to load photos');
      }
    };
    fetchPhotos();
  }, []);

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

    try {
      const formData = new FormData();
      formData.append('photo', file);
      const newPhoto = await putPhoto(formData);
      if (newPhoto)
        setPhotos([newPhoto, ...photos]);
      setFile(null);
      setError(null);
    } catch (err) {
      setError('Failed to upload photo');
    }
  };

  // Handle photo deletion
  const handleDelete = async (photoId: string) => {
    try {
      const res = await deletePhoto(photoId);
      if (res)
        setPhotos(photos.filter(photo => photo.id !== photoId));
      setError(null);
    } catch (err) {
      setError('Failed to delete photo');
    }
  };

  // Determine if the upload button should be enabled
  // It is double checked in server
  const canUploadPhoto = () => {
    if (!userid || !userrole) return false;
    return USER_ROLES.filter(role => role !== 'guest').includes(userrole||"");
  };

  // Determine if the delete button should be enabled
  // It is double checked in server
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
      {canUploadPhoto() && (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button onClick={handleUpload}>
            Upload Photo
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Photo Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {photos.map((photo) => (
          <div key={photo.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <img src={`http://localhost:3001${photo.path}`} alt={photo.filename} style={{ maxWidth: '100%' }} />
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