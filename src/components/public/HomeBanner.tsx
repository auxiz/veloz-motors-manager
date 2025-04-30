
import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

export const HomeBanner = () => {
  return (
    <div className="relative bg-veloz-black min-h-[70vh] flex items-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full grid grid-cols-10 grid-rows-10">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-veloz-yellow"></div>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col items-center">
          <div className="max-w-3xl text-center">
            <img 
              src="/lovable-uploads/4f3db420-b53b-4adc-9b5a-07a1d090a696.png" 
              alt="Veloz Motors" 
              className="h-28 md:h-32 lg:h-36 mb-8 mx-auto object-contain"
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mb-6">
              <span className="text-white">Encontre seu</span>
              <span className="block text-veloz-yellow">veículo ideal</span>
            </h1>
            <p className="text-white text-lg md:text-xl mb-8">
              A Veloz Motors tem o compromisso de oferecer os melhores veículos com as melhores condições para você.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/veiculos" className="btn-primary">
                <Car size={20} />
                Ver Veículos
              </Link>
              <Link to="/contato" className="btn-outline">
                Fale Conosco
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
