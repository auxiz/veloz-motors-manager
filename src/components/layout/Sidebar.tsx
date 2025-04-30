
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Car, User, DollarSign, File, Package, BarChart, Settings, Search, X } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useIsMobile } from '@/hooks/use-mobile';

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export const Sidebar = ({ open, onClose }: SidebarProps) => {
  const { user } = useUsers();
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Certifique-se de que o papel do usuário é 'administrator' para conta autenticada
  const userRole = user?.profile?.role || 'administrator';
  
  console.log("Current user role:", userRole, "User:", user?.email);
  
  // Definir visibilidade dos itens baseado no papel do usuário
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart size={20} />, visible: true },
    { name: 'Estoque', path: '/estoque', icon: <Car size={20} />, visible: true },
    { name: 'Consulta por Placa', path: '/consulta-placa', icon: <Search size={20} />, visible: true },
    { name: 'Vendas', path: '/vendas', icon: <DollarSign size={20} />, visible: ['administrator', 'seller'].includes(userRole) },
    { name: 'Clientes', path: '/clientes', icon: <User size={20} />, visible: true },
    { name: 'Financeiro', path: '/financeiro', icon: <File size={20} />, visible: ['administrator', 'financial'].includes(userRole) },
    { name: 'Relatórios', path: '/relatorios', icon: <Package size={20} />, visible: ['administrator', 'seller', 'financial'].includes(userRole) },
    { name: 'Configurações', path: '/configuracoes', icon: <Settings size={20} />, visible: true },
  ];

  const visibleNavItems = navItems.filter(item => item.visible);
  
  // Handle navigation item click on mobile
  const handleNavClick = () => {
    if (isMobile && open) {
      onClose();
    }
  };

  // Effect to handle location changes
  React.useEffect(() => {
    // Auto close sidebar on navigation on mobile
    if (isMobile && open) {
      onClose();
    }
  }, [location.pathname, isMobile, open, onClose]);

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isMobile && open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      <aside 
        className={`fixed top-0 left-0 h-full bg-veloz-black border-r border-veloz-gray z-50 transition-all duration-300 ${open ? 'w-64' : 'w-0 -translate-x-full'}`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-10">
            <img 
              src="/lovable-uploads/e5725817-aa18-4795-ac65-ef0ef4f65f98.png" 
              alt="Veloz Motors" 
              className="h-16"
            />
            {isMobile && (
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-veloz-gray text-veloz-white"
                aria-label="Fechar menu"
              >
                <X size={20} />
              </button>
            )}
          </div>
          
          <nav className="space-y-1">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-veloz-gray text-veloz-yellow' 
                      : 'text-veloz-white hover:bg-veloz-gray hover:text-veloz-yellow'
                  }`
                }
                onClick={handleNavClick}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
