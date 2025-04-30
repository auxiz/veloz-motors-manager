
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUsers } from '@/hooks/useUsers';
import { toast } from 'sonner';

type HeaderProps = {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
};

export const Header = ({ toggleSidebar, sidebarOpen }: HeaderProps) => {
  const navigate = useNavigate();
  const { signOut } = useUsers();
  
  const handleLogout = async () => {
    const result = await signOut();
    if (!result.error) {
      navigate('/auth');
    } else {
      toast.error('Erro ao fazer logout: ' + result.error.message);
    }
  };

  const handleNotificationsClick = () => {
    toast.info('Você não possui novas notificações');
  };

  return (
    <header className="h-16 bg-veloz-black border-b border-veloz-gray flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-veloz-gray text-veloz-white"
        >
          <Menu size={24} />
        </button>
        <img 
          src="/lovable-uploads/4f3db420-b53b-4adc-9b5a-07a1d090a696.png" 
          alt="Veloz Motors Logo" 
          className="h-10 hidden md:block" 
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          className="p-2 rounded-full hover:bg-veloz-gray text-veloz-white relative"
          onClick={handleNotificationsClick}
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-veloz-yellow rounded-full"></span>
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-veloz-gray">
              <div className="w-8 h-8 rounded-full bg-veloz-gray flex items-center justify-center">
                <User size={18} />
              </div>
              <span className="hidden md:block">Admin</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/configuracoes')}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
