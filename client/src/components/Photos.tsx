import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES } from '../api/auth.api';
import { Photo, getPhotos, putPhoto, deletePhoto } from '../api/photos.api';
import LazyImage from './LazyImage';

const Photos: React.FC = () => {
  const { userid, username, userrole } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch photos
  const fetchPhotos = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const updatedPhotos = await getPhotos();
      setPhotos(updatedPhotos);
      setError(null);
    } catch (err) {
      setError('Failed to load photos');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch and auto-refresh every 30 seconds
  useEffect(() => {
    fetchPhotos();
    const interval = setInterval(fetchPhotos, 30000);
    return () => clearInterval(interval);
  }, [fetchPhotos]);

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
      if (newPhoto) setPhotos([newPhoto, ...photos]);
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
      if (res) setPhotos(photos.filter((photo) => photo.id !== photoId));
      setError(null);
    } catch (err) {
      setError('Failed to delete photo');
    }
  };

  // Determine if the upload button should be enabled
  // It is double checked in server
  const canUploadPhoto = () => {
    if (!userid || !userrole) return false;
    return USER_ROLES.filter((role) => role !== 'guest').includes(userrole || '');
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
    <div className="card">
      <h2 className="text-2xl font-semibold mb-4">Photos</h2>

      {/* Controls */}
      {canUploadPhoto() && (
        <div className="mb-4 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 rounded-md"
          />
          <button onClick={handleUpload} className="btn btn-primary">
            Upload Photo
          </button>
          <button
            onClick={fetchPhotos}
            disabled={isRefreshing}
            className="btn btn-secondary"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Photos'}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Photo Grid (Single Column) */}
      <div className="space-y-4">
        {photos.map((photo) => (
          <LazyImage
            key={photo.id}
            photo={photo}
            canDelete={canDeletePhoto(photo)}
            onDelete={() => handleDelete(photo.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Photos;