
import React from 'react';
import { Calendar, Gauge, Fuel } from 'lucide-react';

interface VehicleSpecsCardsProps {
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
}

export const VehicleSpecsCards: React.FC<VehicleSpecsCardsProps> = ({ 
  year, 
  mileage, 
  fuel, 
  transmission 
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-veloz-gray p-4 rounded-lg flex flex-col items-center">
        <Calendar className="text-veloz-yellow mb-2" />
        <span className="text-white font-semibold">{year}</span>
        <span className="text-sm text-white opacity-70">Ano</span>
      </div>
      <div className="bg-veloz-gray p-4 rounded-lg flex flex-col items-center">
        <Gauge className="text-veloz-yellow mb-2" />
        <span className="text-white font-semibold">{mileage.toLocaleString()} km</span>
        <span className="text-sm text-white opacity-70">Quilometragem</span>
      </div>
      <div className="bg-veloz-gray p-4 rounded-lg flex flex-col items-center">
        <Fuel className="text-veloz-yellow mb-2" />
        <span className="text-white font-semibold">{fuel}</span>
        <span className="text-sm text-white opacity-70">Combustível</span>
      </div>
      <div className="bg-veloz-gray p-4 rounded-lg flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-repeat text-veloz-yellow mb-2">
          <path d="m17 2 4 4-4 4" />
          <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
          <path d="m7 22-4-4 4-4" />
          <path d="M21 13v1a4 4 0 0 1-4 4H3" />
        </svg>
        <span className="text-white font-semibold">{transmission}</span>
        <span className="text-sm text-white opacity-70">Transmissão</span>
      </div>
    </div>
  );
};
