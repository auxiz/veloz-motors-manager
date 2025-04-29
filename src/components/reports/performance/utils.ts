
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Sale } from '@/hooks/useSales';
import { User } from '@/hooks/useUsers';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export interface PerformanceData {
  userId: string;
  name: string;
  salesCount: number;
  totalSales: number;
  totalCommission: number;
  averageValue: number;
}

// Calculate performance data
export const calculatePerformanceData = (filteredSales: Sale[], users: User[]): PerformanceData[] => {
  // Create a map to aggregate sales data by user
  const userPerformance: Record<string, PerformanceData> = {};
  
  // Process each sale
  filteredSales.forEach(sale => {
    const seller = users.find(user => user.id === sale.seller_id);
    
    if (seller) {
      // Initialize user data if not exists
      if (!userPerformance[seller.id]) {
        userPerformance[seller.id] = {
          userId: seller.id,
          name: seller.name,
          salesCount: 0,
          totalSales: 0,
          totalCommission: 0,
          averageValue: 0
        };
      }
      
      // Add sale to user's data
      userPerformance[seller.id].salesCount += 1;
      userPerformance[seller.id].totalSales += Number(sale.final_price);
      userPerformance[seller.id].totalCommission += Number(sale.commission_amount);
    }
  });
  
  // Calculate average values and convert to array
  return Object.values(userPerformance).map(user => ({
    ...user,
    averageValue: user.salesCount > 0 ? user.totalSales / user.salesCount : 0
  })).sort((a, b) => b.totalSales - a.totalSales); // Sort by total sales descending
};

// Prepare chart data
export const prepareChartData = (performanceData: PerformanceData[]) => {
  return performanceData.map(user => ({
    name: user.name,
    sales: user.salesCount,
    value: user.totalSales,
    commission: user.totalCommission
  }));
};

// Create CSV download function
export const createDownloadCSV = (performanceData: PerformanceData[]) => {
  return () => {
    const headers = ['Vendedor', 'Qtd. Vendas', 'Valor Total (R$)', 'Comissões (R$)', 'Média por Venda (R$)'];
    
    const rows = performanceData.map(user => [
      user.name,
      user.salesCount,
      user.totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      user.totalCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      user.averageValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    ]);
    
    let csvContent = headers.join(',') + '\n';
    csvContent += rows.map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `desempenho-vendas-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.click();
    
    URL.revokeObjectURL(url);
  };
};

// Create PDF download function
export const createDownloadPDF = (performanceData: PerformanceData[], filteredSales: Sale[], vehicles: Record<string, any>[], users: User[]) => {
  return () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Relatório de Desempenho de Vendas', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('Veloz Motors LTDA.', 105, 30, { align: 'center' });
    doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, 105, 36, { align: 'center' });
    
    // Add summary section
    doc.setFontSize(14);
    doc.text('Resumo', 20, 50);
    
    const totalSales = filteredSales.length;
    const totalAmount = filteredSales.reduce((sum, sale) => sum + Number(sale.final_price), 0);
    const totalCommissions = filteredSales.reduce((sum, sale) => sum + Number(sale.commission_amount), 0);
    
    doc.setFontSize(12);
    doc.text(`Total de Vendas: ${totalSales}`, 20, 60);
    doc.text(`Valor Total das Vendas: ${totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 20, 66);
    doc.text(`Total de Comissões: ${totalCommissions.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 20, 72);
    
    // Add performance table
    doc.setFontSize(14);
    doc.text('Ranking de Vendedores', 20, 85);
    
    // Table data
    const tableColumn = ['#', 'Vendedor', 'Qtd. Vendas', 'Valor Total (R$)', 'Comissões (R$)', 'Média/Venda (R$)'];
    const tableRows = performanceData.map((user, index) => [
      (index + 1).toString(),
      user.name,
      user.salesCount.toString(),
      user.totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      user.totalCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      user.averageValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    ]);
    
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 90,
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 10 },
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right' }
      },
      headStyles: { fillColor: [41, 128, 185], textColor: [255] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
    
    // Add sales details
    let pageHeight = (doc as any).lastAutoTable.finalY + 20;
    
    // Check if we need a new page
    if (pageHeight > 250) {
      doc.addPage();
      pageHeight = 20;
    }
    
    // Sales details table
    doc.setFontSize(14);
    doc.text('Detalhamento de Vendas', 20, pageHeight);
    
    // Sales details table data
    const detailsColumn = ['Data', 'Vendedor', 'Veículo', 'Cliente', 'Valor', 'Comissão'];
    const detailsRows = filteredSales.map(sale => {
      const seller = users.find(user => user.id === sale.seller_id);
      const vehicle = vehicles.find((v: any) => v.id === sale.vehicle_id);
      
      return [
        format(new Date(sale.sale_date), 'dd/MM/yyyy'),
        seller?.name || 'N/A',
        vehicle ? `${vehicle.brand} ${vehicle.model}` : 'N/A',
        sale.customer?.name || 'N/A',
        Number(sale.final_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        Number(sale.commission_amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      ];
    });
    
    (doc as any).autoTable({
      head: [detailsColumn],
      body: detailsRows,
      startY: pageHeight + 5,
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        4: { halign: 'right' },
        5: { halign: 'right' }
      },
      headStyles: { fillColor: [41, 128, 185], textColor: [255] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
    
    // Save the PDF
    doc.save(`desempenho-vendas-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };
};
