
import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone } from 'lucide-react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-veloz-black border-b border-veloz-gray sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Car size={32} className="text-veloz-yellow" />
              <span className="text-2xl font-montserrat font-bold">
                <span className="text-white">Veloz</span>
                <span className="text-veloz-yellow">Motors</span>
              </span>
            </Link>

            {/* Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className="px-4 py-2 text-white hover:text-veloz-yellow transition-colors">
                    Home
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/veiculos" className="px-4 py-2 text-white hover:text-veloz-yellow transition-colors">
                    Veículos
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/contato" className="px-4 py-2 text-white hover:text-veloz-yellow transition-colors">
                    Contato
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Link to="/contato" className="btn-primary">
                <Phone size={18} />
                <span>Contato</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-veloz-gray py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-veloz-yellow mb-4">Veloz Motors</h3>
              <p className="text-white">Seu parceiro de confiança na busca pelo veículo ideal.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-veloz-yellow mb-4">Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-white hover:text-veloz-yellow transition-colors">Home</Link></li>
                <li><Link to="/veiculos" className="text-white hover:text-veloz-yellow transition-colors">Veículos</Link></li>
                <li><Link to="/contato" className="text-white hover:text-veloz-yellow transition-colors">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-veloz-yellow mb-4">Contato</h3>
              <p className="text-white">(11) 99999-9999</p>
              <p className="text-white">contato@velozmotors.com.br</p>
              <p className="text-white">Av. Paulista, 1000 - São Paulo, SP</p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-700 text-center text-white">
            <p>&copy; {new Date().getFullYear()} Veloz Motors. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp floating button */}
      <a 
        href="https://wa.me/5511999999999" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#20BA5C] text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
        aria-label="Conversar no WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      </a>
    </div>
  );
};
