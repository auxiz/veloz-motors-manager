
import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

export const HomeBanner = () => {
  return (
    <div className="relative bg-gradient-to-b from-veloz-black to-[#1a1a1a] min-h-[80vh] flex items-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full grid grid-cols-10 grid-rows-10">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-veloz-yellow"></div>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 items-center gap-8">
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mb-6">
              <span className="text-white">Encontre seu</span>
              <span className="block text-veloz-yellow">veículo ideal</span>
            </h1>
            <p className="text-white text-lg md:text-xl mb-8">
              A Veloz Motors tem o compromisso de oferecer os melhores veículos com as melhores condições para você.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/veiculos" className="bg-veloz-yellow hover:bg-amber-500 text-veloz-black font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300">
                <Car size={20} />
                Ver Veículos
              </Link>
              <Link to="/contato" className="border-2 border-veloz-yellow bg-transparent hover:bg-veloz-yellow/10 text-veloz-yellow font-semibold px-6 py-3 rounded-lg flex items-center justify-center transition-colors duration-300">
                Fale Conosco
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
