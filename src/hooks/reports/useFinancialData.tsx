
import { useMemo } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  filterTransactionsByDateRange,
  calculateTotals,
  getExpensesByCategory,
  getFinancialDataByMonth,
  CategoryData,
  MonthlyData,
} from '@/components/reports/financial/financial-utils';

interface UseFinancialDataProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

export function useFinancialData({ dateRange }: UseFinancialDataProps) {
  const { transactions } = useTransactions();
  
  // Process all financial data in one hook
  const financialData = useMemo(() => {
    // Filter transactions by date range
    const filteredTransactions = filterTransactionsByDateRange(transactions, dateRange);
    
    // Calculate totals
    const { totalRevenue, totalExpenses, profit } = calculateTotals(filteredTransactions);
    
    // Get expenses by category
    const categoryData = getExpensesByCategory(filteredTransactions);
    
    // Get financial data by month
    const monthlyData = getFinancialDataByMonth(filteredTransactions);

    return {
      filteredTransactions,
      totalRevenue,
      totalExpenses,
      profit,
      categoryData,
      monthlyData
    };
  }, [transactions, dateRange]);

  // CSV export functionality
  const generateCSVContent = (data: MonthlyData[]) => {
    const headers = ['Mês', 'Receitas', 'Despesas', 'Lucro'];
    
    const rows = data.map(item => [
      item.month,
      item.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      item.expenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      item.profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    ]);
    
    let csvContent = headers.join(',') + '\n';
    csvContent += rows.map(row => row.join(',')).join('\n');
    
    return csvContent;
  };

  const downloadCSV = () => {
    const csvContent = generateCSVContent(financialData.monthlyData);
    const filename = `relatorio-financeiro-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return {
    ...financialData,
    downloadCSV
  };
}
