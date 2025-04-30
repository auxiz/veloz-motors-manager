
import { Sale } from '@/types/sales';
import { useSalesQuery } from './sales/useSalesQuery';
import { useSalesMutations } from './sales/useSalesMutations';

/**
 * Main hook for sales operations, composing all sales-related hooks
 */
export const useSales = () => {
  const { sales, isLoading, getSalesByVehicleId, refreshSales } = useSalesQuery();
  const { addSale, deleteSale } = useSalesMutations();

  return {
    sales,
    isLoading,
    addSale,
    getSalesByVehicleId,
    deleteSale,
    refreshSales,
  };
};

// Re-export the Sale type for backward compatibility
export type { Sale } from '@/types/sales';
