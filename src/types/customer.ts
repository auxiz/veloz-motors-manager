
export type Customer = {
  id: string;
  name: string;
  document: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  internal_notes: string | null;
  birth_date: string | null;  // Using string for ISO date format from database
  tags: string[] | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
};

export type CustomerSegment = {
  id: string;
  label: string;
  description?: string;
  type: 'behavior' | 'preference' | 'status';
};

export const CUSTOMER_SEGMENTS: CustomerSegment[] = [
  // Behavior segments
  { id: 'new', label: 'Novo Cliente', description: 'Cliente em primeira compra', type: 'behavior' },
  { id: 'frequent', label: 'Comprador Frequente', description: 'Realizou mais de uma compra', type: 'behavior' },
  
  // Preference segments
  { id: 'suv', label: 'Preferência: SUV', description: 'Cliente com interesse em SUVs', type: 'preference' },
  { id: 'sedan', label: 'Preferência: Sedan', description: 'Cliente com interesse em Sedans', type: 'preference' },
  { id: 'pickup', label: 'Preferência: Pickup', description: 'Cliente com interesse em Pickups', type: 'preference' },
  
  // Status segments
  { id: 'lead', label: 'Lead', description: 'Potencial cliente em negociação', type: 'status' },
  { id: 'active', label: 'Cliente Ativo', description: 'Cliente com compras recentes', type: 'status' },
  { id: 'inactive', label: 'Cliente Inativo', description: 'Cliente sem compras recentes', type: 'status' },
];
