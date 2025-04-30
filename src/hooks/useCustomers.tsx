
import { useCustomerQueries } from './customers/useCustomerQueries';
import { useCustomerMutations } from './customers/useCustomerMutations';
import { useCustomerTags } from './customers/useCustomerTags';

/**
 * Main hook for customer operations that composes the smaller hooks
 */
export const useCustomers = () => {
  // Get customer data and loading state
  const { customers, isLoading } = useCustomerQueries();
  
  // Get customer mutation operations
  const { addCustomer, updateCustomer, deleteCustomer } = useCustomerMutations();
  
  // Get tag management operations
  const { addTagToCustomer, removeTagFromCustomer } = useCustomerTags(customers);

  return {
    // Data
    customers,
    isLoading,
    
    // Mutations
    addCustomer,
    updateCustomer,
    deleteCustomer,
    
    // Tag operations
    addTagToCustomer,
    removeTagFromCustomer
  };
};
