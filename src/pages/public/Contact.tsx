
import React from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';

const Contact = () => {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-montserrat font-bold mb-8 text-white">
          Entre em <span className="text-veloz-yellow">Contato</span>
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-veloz-gray rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Informações de Contato</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-veloz-yellow font-semibold mb-1">Endereço</h3>
                  <p className="text-white">Av. Paulista, 1000</p>
                  <p className="text-white">São Paulo - SP</p>
                </div>
                
                <div>
                  <h3 className="text-veloz-yellow font-semibold mb-1">Telefone</h3>
                  <p className="text-white">(11) 99999-9999</p>
                </div>
                
                <div>
                  <h3 className="text-veloz-yellow font-semibold mb-1">Email</h3>
                  <p className="text-white">contato@velozmotors.com.br</p>
                </div>
                
                <div>
                  <h3 className="text-veloz-yellow font-semibold mb-1">Horário de Funcionamento</h3>
                  <p className="text-white">Segunda a Sexta: 8h às 18h</p>
                  <p className="text-white">Sábado: 8h às 13h</p>
                </div>
              </div>
            </div>
            
            <div className="bg-veloz-gray rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Atendimento</h2>
              <p className="text-white mb-4">
                Prefere uma conversa mais direta? Entre em contato pelo WhatsApp para um atendimento rápido e personalizado.
              </p>
              <a 
                href="https://wa.me/5511999999999" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary w-full justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                </svg>
                Conversar no WhatsApp
              </a>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-veloz-gray rounded-lg p-6 h-full">
              <h2 className="text-xl font-semibold text-white mb-4">Nossa Localização</h2>
              <div className="rounded-lg overflow-hidden h-[400px]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0998810681686!2d-46.65390492368068!3d-23.563243061359726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1682909265557!5m2!1spt-BR!2sbr" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização Veloz Motors"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Contact;
