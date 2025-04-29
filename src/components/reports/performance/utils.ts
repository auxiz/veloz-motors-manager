
import { Sale } from '@/hooks/useSales';
import { User } from '@/hooks/useUsers';
import { format } from 'date-fns';

// Calculate sales performance by user
export const calculatePerformanceData = (
  filteredSales: Sale[],
  users: User[]
) => {
  const salesByUser: Record<string, {
    userId: string;
    name: string;
    salesCount: number;
    totalSales: number;
    totalCommission: number;
    averageValue: number;
  }> = {};
  
  filteredSales.forEach(sale => {
    const { seller_id, final_price, commission_amount } = sale;
    const user = users.find(u => u.id === seller_id);
    
    if (!user) return;
    
    if (!salesByUser[seller_id]) {
      salesByUser[seller_id] = {
        userId: seller_id,
        name: user.name,
        salesCount: 0,
        totalSales: 0,
        totalCommission: 0,
        averageValue: 0
      };
    }
    
    salesByUser[seller_id].salesCount += 1;
    salesByUser[seller_id].totalSales += Number(final_price);
    salesByUser[seller_id].totalCommission += Number(commission_amount);
  });
  
  // Calculate average sale value for each user
  Object.keys(salesByUser).forEach(userId => {
    const { salesCount, totalSales } = salesByUser[userId];
    salesByUser[userId].averageValue = salesCount > 0 ? totalSales / salesCount : 0;
  });
  
  // Convert to array for sorting and rendering
  return Object.values(salesByUser).sort((a, b) => b.totalSales - a.totalSales);
};

// Prepare chart data
export const prepareChartData = (performanceData: ReturnType<typeof calculatePerformanceData>) => {
  return performanceData.map(user => ({
    name: user.name,
    sales: user.totalSales,
    commission: user.totalCommission,
    count: user.salesCount
  }));
};

// Download CSV function
export const createDownloadCSV = (performanceData: ReturnType<typeof calculatePerformanceData>) => {
  return () => {
    const headers = ['Vendedor', 'Vendas', 'Valor Total', 'Comissões', 'Valor Médio'];
    
    const rows = performanceData.map(user => [
      user.name,
      user.salesCount,
      user.totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      user.totalCommission.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      user.averageValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    ]);
    
    let csvContent = headers.join(',') + '\n';
    csvContent += rows.map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `desempenho-vendedores-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.click();
    
    URL.revokeObjectURL(url);
  };
};
