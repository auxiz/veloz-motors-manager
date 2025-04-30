
import React, { useState, useEffect } from 'react';
import { Car } from 'lucide-react';
import { Vehicle } from '@/hooks/useVehicles';

interface VehicleGalleryProps {
  vehicle: Vehicle;
}

export const VehicleGallery: React.FC<VehicleGalleryProps> = ({ vehicle }) => {
  const [activeImage, setActiveImage] = useState<number>(0);

  useEffect(() => {
    // Reset active image when vehicle changes
    setActiveImage(0);
  }, [vehicle.id]);

  return (
    <div>
      <div className="bg-veloz-black rounded-lg overflow-hidden mb-4 h-80 md:h-96">
        {vehicle.photos && vehicle.photos.length > 0 ? (
          <img 
            src={vehicle.photos[activeImage]} 
            alt={`${vehicle.brand} ${vehicle.model}`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car size={96} className="text-veloz-yellow opacity-30" />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {vehicle.photos && vehicle.photos.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {vehicle.photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`h-20 bg-veloz-black rounded-md overflow-hidden border-2 ${
                index === activeImage ? 'border-veloz-yellow' : 'border-transparent'
              }`}
            >
              <img 
                src={photo} 
                alt={`${vehicle.brand} ${vehicle.model} - photo ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
