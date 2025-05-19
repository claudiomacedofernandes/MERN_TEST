import React, { useState, useEffect } from 'react';
import { Photo } from '../api/photos.api';

const API_URL = `${process.env.REACT_APP_STORAGE_API}`;

// Lazy-loaded Image Component
const LazyImage: React.FC<{
    photo: Photo;
    canDelete: boolean;
    onDelete: () => void;
    openModal: (photo: Photo) => void;
}> = ({ photo, canDelete, onDelete, openModal }) => {
    const [isVisible, setIsVisible] = useState(false);
    const imgRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if (imgRef.current) observer.observe(imgRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={imgRef} className="relative">
            {isVisible ? (
                <div className="card">
                    <div
                        key={photo.id}
                        className="cursor-pointer"
                        onClick={() => openModal(photo)}
                    >
                        <img
                            src={`${API_URL}${photo.path}`}
                            alt={photo.filename}
                            className="w-full h-80 object-cover rounded-md mb-2"
                            loading="lazy"
                        />
                    </div>
                    <p className="text-sm text-gray-600">Uploaded by: {photo.username}</p>
                    <p className="text-sm text-gray-600">
                        Date: {new Date(photo.uploadedAt).toLocaleDateString()}
                    </p>
                    {(
                        <button
                            onClick={onDelete}
                            className="btn btn-danger mt-2"
                            disabled={!canDelete}
                        >
                            Delete
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-gray-300 rounded-md w-full h-80 animate-pulse-50-100"></div>
            )}
        </div>
    );
};

export default LazyImage;  