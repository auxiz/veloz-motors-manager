
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Vehicle } from '@/hooks/useVehicles';
import { Car, Calendar, Gauge, Fuel, ArrowLeft, MessageCircle, Calculator } from 'lucide-react';
import { FinancingSimulatorContainer } from '@/components/public/financing/FinancingSimulatorContainer';

const VehicleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeImage, setActiveImage] = useState<number>(0);
  const [showFinancing, setShowFinancing] = useState<boolean>(false);
  
  const { data: vehicle, isLoading, isError } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      if (!id) throw new Error('No vehicle ID provided');
      
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching vehicle details:', error);
        throw error;
      }
      
      return data as Vehicle;
    },
  });

  useEffect(() => {
    // Reset active image when vehicle changes
    setActiveImage(0);
  }, [vehicle?.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <Car className="h-12 w-12 text-veloz-yellow animate-pulse" />
              <p className="text-white text-lg">Carregando informações do veículo...</p>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (isError || !vehicle) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="bg-veloz-black rounded-lg p-8 text-center">
            <Car className="h-16 w-16 mx-auto text-veloz-yellow mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold text-white mb-2">Veículo não encontrado</h2>
            <p className="text-white mb-6">O veículo que você está procurando não está disponível.</p>
            <Link to="/veiculos" className="btn-primary inline-flex">
              <ArrowLeft size={18} />
              Ver outros veículos
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Link to="/veiculos" className="text-white hover:text-veloz-yellow flex items-center gap-2">
            <ArrowLeft size={18} />
            Voltar para veículos
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vehicle Images */}
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

          {/* Vehicle Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-montserrat font-bold mb-2 text-white">
              {vehicle.brand} {vehicle.model}
              {vehicle.version && ` ${vehicle.version}`}
            </h1>
            <div className="mb-4">
              <p className="text-veloz-yellow font-montserrat font-bold text-3xl">
                {formatPrice(vehicle.sale_price)}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-veloz-gray p-4 rounded-lg flex flex-col items-center">
                <Calendar className="text-veloz-yellow mb-2" />
                <span className="text-white font-semibold">{vehicle.year}</span>
                <span className="text-sm text-white opacity-70">Ano</span>
              </div>
              <div className="bg-veloz-gray p-4 rounded-lg flex flex-col items-center">
                <Gauge className="text-veloz-yellow mb-2" />
                <span className="text-white font-semibold">{vehicle.mileage.toLocaleString()} km</span>
                <span className="text-sm text-white opacity-70">Quilometragem</span>
              </div>
              <div className="bg-veloz-gray p-4 rounded-lg flex flex-col items-center">
                <Fuel className="text-veloz-yellow mb-2" />
                <span className="text-white font-semibold">{vehicle.fuel}</span>
                <span className="text-sm text-white opacity-70">Combustível</span>
              </div>
              <div className="bg-veloz-gray p-4 rounded-lg flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-repeat text-veloz-yellow mb-2">
                  <path d="m17 2 4 4-4 4" />
                  <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
                  <path d="m7 22-4-4 4-4" />
                  <path d="M21 13v1a4 4 0 0 1-4 4H3" />
                </svg>
                <span className="text-white font-semibold">{vehicle.transmission}</span>
                <span className="text-sm text-white opacity-70">Transmissão</span>
              </div>
            </div>

            <div className="bg-veloz-gray p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Detalhes do Veículo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-white opacity-70">Marca</span>
                  <span className="text-white font-semibold">{vehicle.brand}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white opacity-70">Modelo</span>
                  <span className="text-white font-semibold">{vehicle.model}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white opacity-70">Versão</span>
                  <span className="text-white font-semibold">{vehicle.version || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white opacity-70">Ano</span>
                  <span className="text-white font-semibold">{vehicle.year}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white opacity-70">Cor</span>
                  <span className="text-white font-semibold">{vehicle.color}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white opacity-70">Placa</span>
                  <span className="text-white font-semibold">{vehicle.plate ? `${vehicle.plate.slice(0, 3)}****` : "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <a 
                href={`https://wa.me/5511999999999?text=Olá! Estou interessado no veículo ${vehicle.brand} ${vehicle.model} ${vehicle.year} (${vehicle.id})`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary flex-1 text-lg py-3 justify-center"
              >
                <MessageCircle size={20} />
                Tenho interesse
              </a>
              
              <button 
                onClick={() => setShowFinancing(!showFinancing)} 
                className="btn-secondary flex-1 text-lg py-3 justify-center"
              >
                <Calculator size={20} />
                Simular Financiamento
              </button>
            </div>
          </div>
        </div>

        {/* Financing Simulator Section */}
        {showFinancing && (
          <div className="mt-8 pt-8 border-t border-veloz-gray">
            <h2 className="text-2xl font-montserrat font-bold mb-6 text-white flex items-center gap-2">
              <Calculator className="text-veloz-yellow" />
              Simulação de Financiamento
            </h2>
            <FinancingSimulatorContainer initialVehiclePrice={vehicle.sale_price} />
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default VehicleDetails;
