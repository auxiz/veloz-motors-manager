
import React from 'react';

interface VehicleDetailsCardProps {
  brand: string;
  model: string;
  version: string | null;
  year: number;
  color: string;
  plate: string | null;
}

export const VehicleDetailsCard: React.FC<VehicleDetailsCardProps> = ({
  brand,
  model,
  version,
  year,
  color,
  plate
}) => {
  return (
    <div className="bg-veloz-gray p-6 rounded-lg mb-6">
      <h3 className="text-xl font-semibold text-white mb-4">Detalhes do Veículo</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-white opacity-70">Marca</span>
          <span className="text-white font-semibold">{brand}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white opacity-70">Modelo</span>
          <span className="text-white font-semibold">{model}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white opacity-70">Versão</span>
          <span className="text-white font-semibold">{version || "N/A"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white opacity-70">Ano</span>
          <span className="text-white font-semibold">{year}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white opacity-70">Cor</span>
          <span className="text-white font-semibold">{color}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white opacity-70">Placa</span>
          <span className="text-white font-semibold">{plate ? `${plate.slice(0, 3)}****` : "N/A"}</span>
        </div>
      </div>
    </div>
  );
};
