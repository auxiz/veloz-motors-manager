
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from '@/types/auth';
import { useUsers } from '@/hooks/useUsers';

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface SalespersonCategory {
  id: string;
  user_id: string;
  category_id: string;
  assigned_at: string;
}

const SalespeopleSettings: React.FC = () => {
  const [salespeople, setSalespeople] = useState<UserProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [salespeopleCategories, setSalespeopleCategories] = useState<SalespersonCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUsers();
  
  const isAdmin = user?.profile?.role === 'administrator';
  
  // Fetch salespeople and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch salespeople
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'seller');
          
        if (profilesError) throw profilesError;
        setSalespeople(profilesData as UserProfile[]);
        
        // Fetch categories using the RPC function
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('vehicle_categories')
          .select('*');
          
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData as Category[]);
        
        // Fetch salesperson categories using the RPC function
        const { data: spCategoriesData, error: spCategoriesError } = await supabase
          .from('salesperson_categories')
          .select('*');
          
        if (spCategoriesError) throw spCategoriesError;
        setSalespeopleCategories(spCategoriesData as SalespersonCategory[]);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Falha ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    return category?.description || category?.name || '';
  };
  
  const getSalespersonCategories = (userId: string): string[] => {
    return salespeopleCategories
      .filter(sc => sc.user_id === userId)
      .map(sc => sc.category_id);
  };
  
  const handleCategoryChange = async (userId: string, categoryId: string, isSelected: boolean) => {
    if (!isAdmin) {
      toast.error('Apenas administradores podem alterar categorias de vendedores');
      return;
    }
    
    try {
      if (isSelected) {
        // Add category using RPC function
        const { data, error } = await supabase
          .rpc('assign_salesperson_category', {
            p_user_id: userId,
            p_category_id: categoryId
          });
          
        if (error) throw error;
        
        // Update local state
        setSalespeopleCategories([
          ...salespeopleCategories,
          { 
            id: data || "", 
            user_id: userId, 
            category_id: categoryId,
            assigned_at: new Date().toISOString()
          }
        ]);
        
        toast.success('Categoria atribuída com sucesso');
      } else {
        // Remove category using RPC function
        const { error } = await supabase
          .rpc('remove_salesperson_category', {
            p_user_id: userId,
            p_category_id: categoryId
          });
          
        if (error) throw error;
        
        // Update local state
        setSalespeopleCategories(
          salespeopleCategories.filter(
            sc => !(sc.user_id === userId && sc.category_id === categoryId)
          )
        );
        
        toast.success('Categoria removida com sucesso');
      }
    } catch (error) {
      console.error('Error updating salesperson category:', error);
      toast.error('Falha ao atualizar categoria');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-veloz-white">Configurações de Vendedores</h2>
      </div>
      
      {!isAdmin && (
        <Card className="bg-yellow-900 border-yellow-800 text-white">
          <CardHeader className="pb-2">
            <CardTitle>Acesso de Administrador Necessário</CardTitle>
            <CardDescription className="text-gray-300">
              Apenas administradores podem gerenciar configurações de vendedores.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
      
      <Card className="bg-veloz-gray border-veloz-gray text-white">
        <CardHeader>
          <CardTitle>Atribuições de Categorias</CardTitle>
          <CardDescription className="text-gray-300">
            Atribua vendedores às categorias de veículos para gerenciar a distribuição de leads.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : salespeople.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Nenhum vendedor disponível
            </div>
          ) : (
            <div className="space-y-6">
              {salespeople.map((salesperson) => (
                <div key={salesperson.id} className="p-4 border border-veloz-black rounded-md">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-medium">
                        {salesperson.first_name} {salesperson.last_name}
                      </h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {getSalespersonCategories(salesperson.id).map((categoryId) => (
                        <div 
                          key={categoryId} 
                          className="bg-veloz-black text-white text-sm py-1 px-3 rounded-full"
                        >
                          {getCategoryName(categoryId)}
                        </div>
                      ))}
                      
                      {getSalespersonCategories(salesperson.id).length === 0 && (
                        <div className="text-sm text-gray-400">Nenhuma categoria atribuída</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categories.map((category) => {
                      const isSelected = salespeopleCategories.some(
                        sc => sc.user_id === salesperson.id && sc.category_id === category.id
                      );
                      
                      return (
                        <Button
                          key={category.id}
                          variant={isSelected ? "default" : "outline"}
                          className={`
                            ${isSelected 
                              ? "bg-veloz-yellow text-black hover:bg-yellow-500" 
                              : "border-veloz-black text-white hover:bg-veloz-black/50"
                            }
                          `}
                          onClick={() => handleCategoryChange(salesperson.id, category.id, !isSelected)}
                          disabled={!isAdmin}
                        >
                          {isSelected ? '✓ ' : ''}{category.description || category.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalespeopleSettings;
