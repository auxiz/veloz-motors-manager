
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Vehicle } from '@/hooks/useVehicles';
import { ArrowLeft } from 'lucide-react';
import { VehicleGallery } from '@/components/public/vehicle/VehicleGallery';
import { VehicleHeader } from '@/components/public/vehicle/VehicleHeader';
import { VehicleSpecsCards } from '@/components/public/vehicle/VehicleSpecsCards';
import { VehicleDetailsCard } from '@/components/public/vehicle/VehicleDetailsCard';
import { VehicleActions } from '@/components/public/vehicle/VehicleActions';
import { VehicleFinancingSection } from '@/components/public/vehicle/VehicleFinancingSection';
import { VehicleLoading } from '@/components/public/vehicle/VehicleLoading';
import { VehicleError } from '@/components/public/vehicle/VehicleError';

const VehicleDetails = () => {
  const { id } = useParams<{ id: string }>();
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

  if (isLoading) {
    return <VehicleLoading />;
  }

  if (isError || !vehicle) {
    return <VehicleError />;
  }

  const toggleFinancing = () => {
    setShowFinancing(!showFinancing);
  };

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
          <VehicleGallery vehicle={vehicle} />

          {/* Vehicle Info */}
          <div>
            <VehicleHeader 
              brand={vehicle.brand} 
              model={vehicle.model} 
              version={vehicle.version} 
              price={vehicle.sale_price} 
            />
            
            <VehicleSpecsCards 
              year={vehicle.year}
              mileage={vehicle.mileage}
              fuel={vehicle.fuel}
              transmission={vehicle.transmission}
            />

            <VehicleDetailsCard 
              brand={vehicle.brand}
              model={vehicle.model}
              version={vehicle.version}
              year={vehicle.year}
              color={vehicle.color}
              plate={vehicle.plate}
            />

            <VehicleActions 
              vehicle={vehicle}
              onFinancingClick={toggleFinancing}
            />
          </div>
        </div>

        {/* Financing Simulator Section */}
        <VehicleFinancingSection 
          show={showFinancing}
          vehiclePrice={vehicle.sale_price}
        />
      </div>
    </PublicLayout>
  );
};

export default VehicleDetails;
