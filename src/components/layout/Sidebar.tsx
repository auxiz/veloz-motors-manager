
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Car, User, DollarSign, File, Package, BarChart, Settings } from 'lucide-react';

type SidebarProps = {
  open: boolean;
};

export const Sidebar = ({ open }: SidebarProps) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart size={20} /> },
    { name: 'Estoque', path: '/estoque', icon: <Car size={20} /> },
    { name: 'Vendas', path: '/vendas', icon: <DollarSign size={20} /> },
    { name: 'Clientes', path: '/clientes', icon: <User size={20} /> },
    { name: 'Financeiro', path: '/financeiro', icon: <File size={20} /> },
    { name: 'Relatórios', path: '/relatorios', icon: <Package size={20} /> },
    { name: 'Configurações', path: '/configuracoes', icon: <Settings size={20} /> },
  ];

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
          {navItems.map((item) => (
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
