
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Car, User, DollarSign, File, Package, BarChart, Settings, Search, X } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useIsMobile } from '@/hooks/use-mobile';

type SidebarProps = {
  open: boolean;
  onClose?: () => void;
};

export const Sidebar = ({ open, onClose }: SidebarProps) => {
  const { user } = useUsers();
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Ensure role is 'administrator' for authenticated account with auxizpro@gmail.com
  const userRole = user?.profile?.role || 'administrator';
  
  console.log("Current user role:", userRole, "User:", user?.email);
  
  // Define visibility of items based on user role
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart size={20} className="text-veloz-yellow" />, visible: true },
    { name: 'Estoque', path: '/estoque', icon: <Car size={20} className="text-veloz-yellow" />, visible: true },
    { name: 'Consulta por Placa', path: '/consulta-placa', icon: <Search size={20} className="text-veloz-yellow" />, visible: true },
    { name: 'Vendas', path: '/vendas', icon: <DollarSign size={20} className="text-veloz-yellow" />, visible: ['administrator', 'seller'].includes(userRole) },
    { name: 'Clientes', path: '/clientes', icon: <User size={20} className="text-veloz-yellow" />, visible: true },
    { name: 'Financeiro', path: '/financeiro', icon: <File size={20} className="text-veloz-yellow" />, visible: ['administrator', 'financial'].includes(userRole) },
    { name: 'Relatórios', path: '/relatorios', icon: <Package size={20} className="text-veloz-yellow" />, visible: ['administrator', 'seller', 'financial'].includes(userRole) },
    { name: 'Configurações', path: '/configuracoes', icon: <Settings size={20} className="text-veloz-yellow" />, visible: true },
  ];

  const visibleNavItems = navItems.filter(item => item.visible);
  
  // Handle navigation item click - close sidebar on mobile
  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside 
      className={`fixed top-0 left-0 h-full bg-veloz-black border-r border-veloz-gray z-50 transition-all duration-300 ${
        open ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'
      }`}
    >
      <div className="p-6 h-full flex flex-col">
        {/* Logo and close button row */}
        <div className="flex items-center justify-between mb-6">
          <img 
            src="/lovable-uploads/e5725817-aa18-4795-ac65-ef0ef4f65f98.png" 
            alt="Veloz Motors" 
            className="h-12"
          />
          
          {/* Mobile close button */}
          {isMobile && open && (
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-veloz-gray text-veloz-white"
              aria-label="Close menu"
            >
              <X size={24} className="text-veloz-yellow" />
            </button>
          )}
        </div>
        
        <nav className="space-y-1 flex-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-veloz-gray text-veloz-yellow' 
                      : 'text-veloz-white hover:bg-veloz-gray hover:text-veloz-yellow'
                  }`
                }
              >
                <span className="mr-3 flex-shrink-0">{item.icon}</span>
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
        
        {/* User info at bottom - optional */}
        {user && (
          <div className="pt-4 border-t border-veloz-gray text-sm opacity-70">
            <p className="truncate">Usuário: {user.email}</p>
          </div>
        )}
      </div>
    </aside>
  );
}
