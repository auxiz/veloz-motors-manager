
import React from 'react';
import { Link } from 'react-router-dom';
import { usePublicVehicles } from '@/hooks/usePublicVehicles';
import { VehicleCard } from './VehicleCard';

export const FeaturedVehicles = () => {
  const { featuredVehicles, isLoading } = usePublicVehicles();

  return (
    <section className="py-16 bg-veloz-black">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-montserrat font-semibold text-white">
            Veículos em <span className="text-veloz-yellow">Destaque</span>
          </h2>
          <Link to="/veiculos" className="text-veloz-yellow hover:text-white transition-colors flex items-center gap-1">
            Ver todos
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-veloz-gray animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} featured />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
