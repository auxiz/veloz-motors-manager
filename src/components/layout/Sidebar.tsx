
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Car, User, DollarSign, File, Package, BarChart, Settings, Search } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';

type SidebarProps = {
  open: boolean;
};

export const Sidebar = ({ open }: SidebarProps) => {
  const { user } = useUsers();
  const userRole = user?.profile?.role || '';
  
  // Define page access by role
  const canAccessVendas = ['administrator', 'seller'].includes(userRole);
  const canAccessFinanceiro = ['administrator', 'financial'].includes(userRole);
  const canAccessRelatorios = ['administrator', 'seller', 'financial'].includes(userRole);
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart size={20} />, visible: true },
    { name: 'Estoque', path: '/estoque', icon: <Car size={20} />, visible: true },
    { name: 'Consulta por Placa', path: '/consulta-placa', icon: <Search size={20} />, visible: true },
    { name: 'Vendas', path: '/vendas', icon: <DollarSign size={20} />, visible: canAccessVendas },
    { name: 'Clientes', path: '/clientes', icon: <User size={20} />, visible: true },
    { name: 'Financeiro', path: '/financeiro', icon: <File size={20} />, visible: canAccessFinanceiro },
    { name: 'Relatórios', path: '/relatorios', icon: <Package size={20} />, visible: canAccessRelatorios },
    { name: 'Configurações', path: '/configuracoes', icon: <Settings size={20} />, visible: true },
  ];

  const visibleNavItems = navItems.filter(item => item.visible);

  return (
    <aside 
      className={`fixed top-0 left-0 h-full bg-veloz-black border-r border-veloz-gray z-50 transition-all duration-300 ${open ? 'w-64' : 'w-0 -translate-x-full'}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-center mb-10">
          <img 
            src="/lovable-uploads/e5725817-aa18-4795-ac65-ef0ef4f65f98.png" 
            alt="Veloz Motors" 
            className="h-16"
          />
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
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};
