import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES } from '../api/auth.api';
import { Photo, getPhotos, putPhoto, deletePhoto } from '../api/photos.api';
import LazyImage from './LazyImage';

const PHOTOS_AUTO_REFRESH_INTERVAL = 30000;

const Photos: React.FC = () => {
  const { userid, username, userrole } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch photos
  const fetchPhotos = useCallback(async () => {
    try {
      setError(null);
      setIsRefreshing(true);
      const updatedPhotos = await getPhotos();
      setPhotos(updatedPhotos);
    } catch (err) {
      setError('Failed to load photos');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchPhotos();
    const interval = setInterval(fetchPhotos, PHOTOS_AUTO_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchPhotos]);

  // Handle upload button click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection and auto-upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setError(null);
      const formData = new FormData();
      formData.append('photo', file);
      const newPhoto = await putPhoto(formData);
      if (newPhoto) setPhotos([newPhoto, ...photos]);
    } catch (err) {
      setError('Failed to upload photo');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle photo deletion
  const handleDelete = async (photoId: string) => {
    try {
      setError(null);
      const res = await deletePhoto(photoId);
      if (res) setPhotos(photos.filter((photo) => photo.id !== photoId));
    } catch (err) {
      setError('Failed to delete photo');
    }
  };

  // Open modal
  const openModal = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  // Close modal
  const closeModal = () => {
    setSelectedPhoto(null);
  };

  // Determine if upload is allowed
  const canUploadPhoto = () => {
    if (!userid || !userrole) return false;
    return USER_ROLES.filter((role) => role !== 'guest').includes(userrole);
  };

  // Determine if delete is allowed
  const canDeletePhoto = (photo: Photo) => {
    if (!userid || !userrole) return false;
    if (photo.username === username) return true;
    const userRoleIndex = USER_ROLES.indexOf(userrole);
    const ownerRoleIndex = USER_ROLES.indexOf(photos.find(p => p.username === photo.username)?.userrole || 'user');
    return userRoleIndex < ownerRoleIndex;
  };

  return (
    <div className="card p-4">
      <h2 className="text-2xl font-semibold">Photos</h2>
      <div className="sticky top-0 z-10 bg-white p-4 -mx-4 border-b shadow-sm flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
        <div className="flex flex-wrap items-start sm:items-center gap-2 sm:gap-4">
          <button
            onClick={fetchPhotos}
            disabled={isRefreshing}
            className="btn btn-secondary"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Photos'}
          </button>
          {canUploadPhoto() && (
            <>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={handleUploadClick}
                className="btn btn-primary"
              >
                UploadPhoto
              </button>
            </>
          )}
          {error && (
            <p className="text-red-500 text-sm sm:ml-auto w-full sm:w-auto text-left sm:text-right">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4 mt-4">
        {photos.map((photo, index) => (
          <LazyImage
            key={index}
            photo={photo}
            canDelete={canDeletePhoto(photo)}
            onDelete={() => handleDelete(photo.id)}
            openModal={openModal}
          />
        ))}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={`http://localhost:3001${selectedPhoto.path}`}
              alt={selectedPhoto?.filename}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;