
import React from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { HomeBanner } from '@/components/public/HomeBanner';
import { SearchBar } from '@/components/public/SearchBar';
import { FeaturedVehicles } from '@/components/public/FeaturedVehicles';

const Home = () => {
  return (
    <PublicLayout>
      <HomeBanner />
      
      <div className="container mx-auto px-4 py-12 -mt-12 relative z-10">
        <SearchBar />
      </div>
      
      <FeaturedVehicles />
      
      <section className="py-16 bg-veloz-gray">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-montserrat font-semibold text-white mb-4">
              Por que escolher a <span className="text-veloz-yellow">Veloz Motors</span>?
            </h2>
            <p className="text-white mb-8">
              Na Veloz Motors, estamos comprometidos com a excelência e a satisfação total dos nossos clientes. Conte com nossa experiência para encontrar o veículo dos seus sonhos.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="p-6 bg-veloz-black rounded-lg">
                <div className="rounded-full bg-veloz-yellow w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check text-veloz-black">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-montserrat font-semibold text-white mb-2">Garantia de Qualidade</h3>
                <p className="text-white">Todos os nossos veículos passam por rigorosas inspeções técnicas.</p>
              </div>
              
              <div className="p-6 bg-veloz-black rounded-lg">
                <div className="rounded-full bg-veloz-yellow w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-handshake text-veloz-black">
                    <path d="m11 17 2 2a1 1 0 0 0 1.447-.447L17 14" />
                    <path d="M16.004 9.172a2 2 0 0 0-2.283-.283L11.5 10.5l2 2 1.786-1.429a2 2 0 0 0 .718-2.9Z" />
                    <path d="M3.394 15.394a2 2 0 0 0 2.829 2.829l4.571-4.571L8 11" />
                    <path d="M7 3h10" />
                    <path d="M12 3v4" />
                    <path d="M5 7h14" />
                    <path d="M5 7v4" />
                    <path d="M19 7v4" />
                  </svg>
                </div>
                <h3 className="text-xl font-montserrat font-semibold text-white mb-2">Negociação Transparente</h3>
                <p className="text-white">Preços justos e negociações sem surpresas desagradáveis.</p>
              </div>
              
              <div className="p-6 bg-veloz-black rounded-lg">
                <div className="rounded-full bg-veloz-yellow w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-headphones text-veloz-black">
                    <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
                  </svg>
                </div>
                <h3 className="text-xl font-montserrat font-semibold text-white mb-2">Suporte Contínuo</h3>
                <p className="text-white">Atendimento especializado antes, durante e após a compra.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Home;
