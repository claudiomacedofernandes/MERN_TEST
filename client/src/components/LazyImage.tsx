import React, { useState, useEffect } from 'react';
import { Photo } from '../api/photos.api';

// Lazy-loaded Image Component
const LazyImage: React.FC<{
    photo: Photo;
    canDelete: boolean;
    onDelete: () => void;
}> = ({ photo, canDelete, onDelete }) => {
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
                    <img
                        src={`http://localhost:3001${photo.path}`}
                        alt={photo.filename}
                        className="w-full h-48 object-cover rounded-md mb-2"
                        loading="lazy"
                    />
                    <p className="text-sm text-gray-600">Uploaded by: {photo.username}</p>
                    <p className="text-sm text-gray-600">
                        Date: {new Date(photo.uploadedAt).toLocaleDateString()}
                    </p>
                    {canDelete && (
                        <button
                            onClick={onDelete}
                            className="btn btn-danger mt-2"
                        >
                            Delete
                        </button>
                    )}
                </div>
            ) : (
                <div className="photo-placeholder"></div>
            )}
        </div>
    );
};

export default LazyImage;  