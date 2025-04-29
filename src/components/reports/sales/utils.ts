
import { format, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Sale } from '@/hooks/useSales';
import { Vehicle } from '@/hooks/useVehicles';

// Function to filter sales by criteria
export const filterSales = (
  sales: Sale[],
  dateRange: { from: Date; to: Date },
  selectedBrand: string,
  selectedSeller: string,
  vehicles: Vehicle[]
) => {
  return sales.filter(sale => {
    const saleDate = new Date(sale.sale_date);
    
    // Date range filter
    const inDateRange = isWithinInterval(saleDate, {
      start: dateRange.from,
      end: dateRange.to
    });
    
    // Brand filter
    const vehicle = vehicles.find(v => v.id === sale.vehicle_id);
    const matchesBrand = selectedBrand === 'all' || (vehicle && vehicle.brand === selectedBrand);
    
    // Seller filter
    const matchesSeller = selectedSeller === 'all' || sale.seller_id === selectedSeller;
    
    return inDateRange && matchesBrand && matchesSeller;
  });
};

// Function to generate chart data based on period type
export const generateChartData = (
  filteredSales: Sale[],
  periodType: 'day' | 'week' | 'month'
) => {
  const data: { name: string; value: number; amount: number }[] = [];
  
  // Function to get the period key based on date
  const getPeriodKey = (date: Date) => {
    switch (periodType) {
      case 'day':
        return format(date, 'dd/MM/yyyy', { locale: ptBR });
      case 'week':
        return `Semana ${format(date, 'w', { locale: ptBR })}, ${format(date, 'yyyy')}`;
      case 'month':
        return format(date, 'MMM yyyy', { locale: ptBR });
      default:
        return '';
    }
  };
  
  // Group sales by period
  const salesByPeriod: Record<string, { count: number; amount: number }> = {};
  
  filteredSales.forEach(sale => {
    const saleDate = new Date(sale.sale_date);
    const periodKey = getPeriodKey(saleDate);
    
    if (!salesByPeriod[periodKey]) {
      salesByPeriod[periodKey] = { count: 0, amount: 0 };
    }
    
    salesByPeriod[periodKey].count += 1;
    salesByPeriod[periodKey].amount += Number(sale.final_price);
  });
  
  // Convert to chart data format
  Object.entries(salesByPeriod).forEach(([key, value]) => {
    data.push({
      name: key,
      value: value.count,
      amount: value.amount
    });
  });
  
  return data;
};

// Function to download data as CSV
export const createDownloadCSV = (
  filteredSales: Sale[], 
  vehicles: Vehicle[], 
  users: { id: string; name: string; }[]
) => {
  return () => {
    const headers = ['Data', 'Veículo', 'Vendedor', 'Cliente', 'Valor'];
    
    const rows = filteredSales.map(sale => {
      const vehicle = vehicles.find(v => v.id === sale.vehicle_id);
      const seller = users.find(user => user.id === sale.seller_id);
      
      return [
        format(new Date(sale.sale_date), 'dd/MM/yyyy'),
        vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}` : 'N/A',
        seller ? seller.name : 'N/A',
        sale.customer?.name || 'N/A',
        Number(sale.final_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      ];
    });
    
    let csvContent = headers.join(',') + '\n';
    csvContent += rows.map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-vendas-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.click();
    
    URL.revokeObjectURL(url);
  };
};
