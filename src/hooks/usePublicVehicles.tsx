
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Vehicle } from '@/hooks/useVehicles';

export const usePublicVehicles = (filters?: {
  brand?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'year';
  sortOrder?: 'asc' | 'desc';
}) => {
  // Get a single vehicle by ID
  const getVehicleById = async (id: string) => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .eq('status', 'in_stock')
      .single();
    
    if (error) {
      console.error('Error fetching vehicle:', error);
      throw error;
    }
    
    return data as Vehicle;
  };

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['public-vehicles', filters],
    queryFn: async () => {
      console.log('Fetching public vehicles with filters:', filters);
      
      let query = supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'in_stock');
      
      // Apply filters
      if (filters?.brand) {
        query = query.ilike('brand', `%${filters.brand}%`);
      }
      
      if (filters?.model) {
        query = query.ilike('model', `%${filters.model}%`);
      }
      
      if (filters?.minYear) {
        query = query.gte('year', filters.minYear);
      }
      
      if (filters?.maxYear) {
        query = query.lte('year', filters.maxYear);
      }
      
      if (filters?.minPrice) {
        query = query.gte('sale_price', filters.minPrice);
      }
      
      if (filters?.maxPrice) {
        query = query.lte('sale_price', filters.maxPrice);
      }
      
      // Apply sorting
      if (filters?.sortBy) {
        const order = filters.sortOrder || 'asc';
        query = query.order(filters.sortBy, { ascending: order === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
      }
      
      console.log('Vehicles fetched:', data);
      return data as Vehicle[];
    },
  });
  
  // Get featured vehicles (for home page)
  const { data: featuredVehicles = [] } = useQuery({
    queryKey: ['featured-vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'in_stock')
        .order('sale_price', { ascending: false })
        .limit(4);
      
      if (error) {
        console.error('Error fetching featured vehicles:', error);
        throw error;
      }
      
      return data as Vehicle[];
    },
  });
  
  return {
    vehicles,
    isLoading,
    getVehicleById,
    featuredVehicles
  };
};
