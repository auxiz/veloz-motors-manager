
import { useState } from 'react';
import { UserProfile } from '@/types/auth';

export type UserData = {
  id: string;
  name: string;
  email: string;
  profile?: UserProfile;
};

export function useUserData() {
  const [users, setUsers] = useState<UserData[]>([
    { 
      id: '1', 
      name: 'João Silva', 
      email: 'joao@exemplo.com',
      profile: {
        id: '1',
        first_name: 'João',
        last_name: 'Silva',
        avatar_url: null,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        role: 'administrator',
        status: 'approved'
      }
    },
    { 
      id: '2', 
      name: 'Maria Oliveira', 
      email: 'maria@exemplo.com',
      profile: {
        id: '2',
        first_name: 'Maria',
        last_name: 'Oliveira',
        avatar_url: null,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        role: 'seller',
        status: 'approved'
      }
    },
    { 
      id: '3', 
      name: 'Carlos Santos', 
      email: 'carlos@exemplo.com',
      profile: {
        id: '3',
        first_name: 'Carlos',
        last_name: 'Santos',
        avatar_url: null,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        role: 'financial',
        status: 'approved'
      }
    },
    { 
      id: '4', 
      name: 'Ana Pereira', 
      email: 'ana@exemplo.com',
      profile: {
        id: '4',
        first_name: 'Ana',
        last_name: 'Pereira',
        avatar_url: null,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        role: 'seller',
        status: 'approved'
      }
    },
    { 
      id: '5', 
      name: 'Luiz Costa', 
      email: 'luiz@exemplo.com',
      profile: {
        id: '5',
        first_name: 'Luiz',
        last_name: 'Costa',
        avatar_url: null,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        role: 'seller',
        status: 'approved'
      }
    },
    { 
      id: '6', 
      name: 'Roberto Almeida', 
      email: 'roberto@exemplo.com',
      profile: {
        id: '6',
        first_name: 'Roberto',
        last_name: 'Almeida',
        avatar_url: null,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        role: 'dispatcher',
        status: 'approved'
      }
    },
    { 
      id: '7', 
      name: 'Carla Lima', 
      email: 'carla@exemplo.com',
      profile: {
        id: '7',
        first_name: 'Carla',
        last_name: 'Lima',
        avatar_url: null,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        role: 'dispatcher',
        status: 'approved'
      }
    }
  ]);

  // In a real application, we would fetch users from Supabase here
  // For now, we're just returning the mock data

  return {
    users
  };
}
