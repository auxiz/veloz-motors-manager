
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { SearchBar } from '@/components/public/SearchBar';
import { VehicleCard } from '@/components/public/VehicleCard';
import { usePublicVehicles } from '@/hooks/usePublicVehicles';
import { Car, ArrowUpDown } from 'lucide-react';

const Vehicles = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [filters, setFilters] = useState({
    brand: queryParams.get('brand') || '',
    model: queryParams.get('model') || '',
    minYear: queryParams.get('minYear') ? Number(queryParams.get('minYear')) : undefined,
    maxYear: queryParams.get('maxYear') ? Number(queryParams.get('maxYear')) : undefined,
    minPrice: queryParams.get('minPrice') ? Number(queryParams.get('minPrice')) : undefined,
    maxPrice: queryParams.get('maxPrice') ? Number(queryParams.get('maxPrice')) : undefined,
    sortBy: queryParams.get('sortBy') as 'price' | 'year' || undefined,
    sortOrder: queryParams.get('sortOrder') as 'asc' | 'desc' || 'asc',
  });
  
  const { vehicles, isLoading } = usePublicVehicles(filters);
  
  useEffect(() => {
    setFilters({
      brand: queryParams.get('brand') || '',
      model: queryParams.get('model') || '',
      minYear: queryParams.get('minYear') ? Number(queryParams.get('minYear')) : undefined,
      maxYear: queryParams.get('maxYear') ? Number(queryParams.get('maxYear')) : undefined,
      minPrice: queryParams.get('minPrice') ? Number(queryParams.get('minPrice')) : undefined,
      maxPrice: queryParams.get('maxPrice') ? Number(queryParams.get('maxPrice')) : undefined,
      sortBy: queryParams.get('sortBy') as 'price' | 'year' || undefined,
      sortOrder: queryParams.get('sortOrder') as 'asc' | 'desc' || 'asc',
    });
  }, [location.search]);
  
  const handleSort = (sortBy: 'price' | 'year') => {
    const newSortOrder = filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    
    const params = new URLSearchParams(location.search);
    params.set('sortBy', sortBy);
    params.set('sortOrder', newSortOrder);
    
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
    
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: newSortOrder,
    }));
  };
  
  return (
    <PublicLayout>
      <div className="bg-veloz-gray py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-montserrat font-bold mb-8 text-white">
            Nossos <span className="text-veloz-yellow">Veículos</span>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="sticky top-24">
                <SearchBar />
              </div>
            </div>
            
            <div className="md:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <p className="text-white">
                  {isLoading ? 'Buscando veículos...' : `${vehicles.length} veículos encontrados`}
                </p>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleSort('price')}
                    className={`flex items-center gap-1 ${filters.sortBy === 'price' ? 'text-veloz-yellow' : 'text-white'}`}
                  >
                    <span>Preço</span>
                    <ArrowUpDown size={16} />
                  </button>
                  <button
                    onClick={() => handleSort('year')}
                    className={`flex items-center gap-1 ${filters.sortBy === 'year' ? 'text-veloz-yellow' : 'text-white'}`}
                  >
                    <span>Ano</span>
                    <ArrowUpDown size={16} />
                  </button>
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center gap-4">
                    <Car className="h-12 w-12 text-veloz-yellow animate-pulse" />
                    <p className="text-white text-lg">Carregando veículos...</p>
                  </div>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="flex items-center justify-center h-64 bg-veloz-black rounded-lg">
                  <div className="text-center">
                    <Car className="h-16 w-16 mx-auto text-veloz-yellow mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold text-white mb-2">Nenhum veículo encontrado</h3>
                    <p className="text-white">Tente ajustar os filtros de busca.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Vehicles;
