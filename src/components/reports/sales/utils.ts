
import { format, isWithinInterval, parseISO, startOfWeek, startOfMonth, getWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Sale } from '@/hooks/useSales';
import { Vehicle } from '@/hooks/useVehicles';
import { User } from '@/hooks/useUsers';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Filter sales
export const filterSales = (
  sales: Sale[],
  dateRange: { from: Date; to: Date },
  selectedBrand: string,
  selectedSeller: string,
  vehicles: Vehicle[]
) => {
  return sales.filter(sale => {
    const saleDate = new Date(sale.sale_date);
    
    // Filter by date range
    const inDateRange = isWithinInterval(saleDate, {
      start: dateRange.from,
      end: dateRange.to
    });
    
    // Filter by brand
    const vehicle = vehicles.find(v => v.id === sale.vehicle_id);
    const brandMatch = selectedBrand === 'all' || (vehicle && vehicle.brand === selectedBrand);
    
    // Filter by seller
    const sellerMatch = selectedSeller === 'all' || sale.seller_id === selectedSeller;
    
    return inDateRange && brandMatch && sellerMatch;
  });
};

// Generate chart data
export const generateChartData = (filteredSales: Sale[], periodType: 'day' | 'week' | 'month') => {
  const periods: Record<string, { name: string; value: number; amount: number }> = {};
  
  filteredSales.forEach(sale => {
    const date = new Date(sale.sale_date);
    let periodKey = '';
    let periodLabel = '';
    
    if (periodType === 'day') {
      periodKey = format(date, 'yyyy-MM-dd');
      periodLabel = format(date, 'dd/MM/yyyy');
    } else if (periodType === 'week') {
      const weekStart = startOfWeek(date, { weekStartsOn: 0 });
      periodKey = format(weekStart, 'yyyy-ww');
      periodLabel = `Semana ${getWeek(date)} - ${format(weekStart, 'MMM', { locale: ptBR })}`;
    } else {
      periodKey = format(date, 'yyyy-MM');
      periodLabel = format(date, 'MMM yyyy', { locale: ptBR });
    }
    
    if (!periods[periodKey]) {
      periods[periodKey] = {
        name: periodLabel,
        value: 0,
        amount: 0
      };
    }
    
    periods[periodKey].value += 1;
    periods[periodKey].amount += Number(sale.final_price);
  });
  
  return Object.values(periods).sort((a, b) => {
    // Sort by period name (which should be date formatted)
    return a.name.localeCompare(b.name);
  });
};

// Create download CSV function
export const createDownloadCSV = (filteredSales: Sale[], vehicles: Vehicle[], users: User[]) => {
  return () => {
    const headers = ['Data da Venda', 'Veículo', 'Vendedor', 'Cliente', 'Forma de Pagamento', 'Valor da Venda'];
    
    const rows = filteredSales.map(sale => {
      const vehicle = vehicles.find(v => v.id === sale.vehicle_id);
      const seller = users.find(user => user.id === sale.seller_id);
      
      return [
        format(new Date(sale.sale_date), 'dd/MM/yyyy'),
        vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}` : 'N/A',
        seller ? seller.name : 'N/A',
        sale.customer?.name || 'N/A',
        getPaymentMethodName(sale.payment_method),
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

// Helper function to get payment method name
function getPaymentMethodName(method: string): string {
  const methods: Record<string, string> = {
    'cash': 'À Vista',
    'financing': 'Financiamento',
    'consignment': 'Consignação',
    'exchange': 'Troca'
  };
  
  return methods[method] || method;
}

// Create download PDF function
export const createDownloadPDF = (filteredSales: Sale[], vehicles: Vehicle[], users: User[]) => {
  return () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Relatório de Vendas', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('Veloz Motors LTDA.', 105, 30, { align: 'center' });
    doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, 105, 36, { align: 'center' });
    
    // Prepare data for table
    const tableColumn = ['Data', 'Veículo', 'Vendedor', 'Cliente', 'Forma de Pagamento', 'Valor'];
    const tableRows = filteredSales.map(sale => {
      const vehicle = vehicles.find(v => v.id === sale.vehicle_id);
      const seller = users.find(user => user.id === sale.seller_id);
      
      return [
        format(new Date(sale.sale_date), 'dd/MM/yyyy'),
        vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}` : 'N/A',
        seller ? seller.name : 'N/A',
        sale.customer?.name || 'N/A',
        getPaymentMethodName(sale.payment_method),
        Number(sale.final_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      ];
    });
    
    // Add summary section
    doc.setFontSize(14);
    doc.text('Resumo', 20, 50);
    
    const totalSales = filteredSales.length;
    const totalAmount = filteredSales.reduce((sum, sale) => sum + Number(sale.final_price), 0);
    
    doc.setFontSize(12);
    doc.text(`Total de Vendas: ${totalSales}`, 20, 60);
    doc.text(`Valor Total: ${totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 20, 66);
    doc.text(`Média por Venda: ${totalSales > 0 ? (totalAmount / totalSales).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}`, 20, 72);
    
    // Add table with sale details
    doc.setFontSize(14);
    doc.text('Detalhamento de Vendas', 20, 85);
    
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 90,
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 25 }, // Data
        5: { cellWidth: 30, halign: 'right' } // Valor
      },
      headStyles: { fillColor: [41, 128, 185], textColor: [255] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
    
    // Save the PDF
    doc.save(`relatorio-vendas-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };
};
