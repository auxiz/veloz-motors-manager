import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Menu, X } from 'lucide-react';
export const PublicLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-veloz-black sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/4f3db420-b53b-4adc-9b5a-07a1d090a696.png" alt="Veloz Motors Logo" className="h-30 md:h-30\\\\n" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-lg text-white hover:text-veloz-yellow transition-colors duration-300 font-medium">
                Home
              </Link>
              <Link to="/veiculos" className="text-lg text-white hover:text-veloz-yellow transition-colors duration-300 font-medium">
                Veículos
              </Link>
              <Link to="/contato" className="text-lg text-white hover:text-veloz-yellow transition-colors duration-300 font-medium">
                Contato
              </Link>
              <Link to="/auth" className="bg-veloz-yellow hover:bg-amber-500 text-veloz-black font-semibold px-4 py-2 rounded-lg transition-colors duration-300">
                Área Restrita
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <Link to="/contato" className="bg-veloz-yellow hover:bg-amber-500 text-veloz-black font-medium px-3 py-1.5 rounded-lg mr-3 flex items-center">
                <Phone size={16} className="mr-1" />
                <span>Contato</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white hover:text-veloz-yellow">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && <div className="md:hidden bg-veloz-gray border-t border-gray-700 py-3">
            <div className="container mx-auto px-4">
              <nav className="flex flex-col space-y-3">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-veloz-yellow py-2 border-b border-gray-700">
                  Home
                </Link>
                <Link to="/veiculos" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-veloz-yellow py-2 border-b border-gray-700">
                  Veículos
                </Link>
                <Link to="/contato" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-veloz-yellow py-2 border-b border-gray-700">
                  Contato
                </Link>
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-veloz-yellow py-2">
                  Área Restrita
                </Link>
              </nav>
            </div>
          </div>}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-veloz-gray py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="mb-6">
                <img src="/lovable-uploads/4f3db420-b53b-4adc-9b5a-07a1d090a696.png" alt="Veloz Motors Logo" className="h-16" />
              </div>
              <p className="text-white text-lg">Seu parceiro de confiança na busca pelo veículo ideal.</p>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-white hover:text-veloz-yellow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                </a>
                <a href="#" className="text-white hover:text-veloz-yellow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-veloz-yellow mb-6">Links Rápidos</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-white hover:text-veloz-yellow transition-colors">Home</Link></li>
                <li><Link to="/veiculos" className="text-white hover:text-veloz-yellow transition-colors">Veículos</Link></li>
                <li><Link to="/contato" className="text-white hover:text-veloz-yellow transition-colors">Contato</Link></li>
                <li><Link to="/auth" className="text-white hover:text-veloz-yellow transition-colors">Área Restrita</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-veloz-yellow mb-6">Contato</h3>
              <div className="space-y-4">
                <p className="text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone mr-3"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  (11) 99999-9999
                </p>
                <p className="text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail mr-3"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  contato@velozmotors.com.br
                </p>
                <p className="text-white flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin mr-3 mt-1"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  Av. Paulista, 1000 - São Paulo, SP
                </p>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-gray-700 text-center text-white">
            <p>&copy; {new Date().getFullYear()} Veloz Motors. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp floating button */}
      <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#20BA5C] text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-50" aria-label="Conversar no WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      </a>
    </div>;
};