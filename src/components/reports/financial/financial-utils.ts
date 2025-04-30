
import { format, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface Transaction {
  id: string;
  type: string;
  category: string;
  amount: number;
  due_date: string;
  status: string;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export function filterTransactionsByDateRange(transactions: Transaction[], dateRange: { from: Date; to: Date }) {
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.due_date);
    return isWithinInterval(transactionDate, {
      start: dateRange.from,
      end: dateRange.to
    });
  });
}

export function calculateTotals(filteredTransactions: Transaction[]) {
  const totalRevenue = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const profit = totalRevenue - totalExpenses;

  return { totalRevenue, totalExpenses, profit };
}

export function getExpensesByCategory(filteredTransactions: Transaction[]) {
  const expensesByCategory = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc: Record<string, number>, transaction) => {
      const { category, amount } = transaction;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += Number(amount);
      return acc;
    }, {});
  
  return Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value
  }));
}

export function getFinancialDataByMonth(filteredTransactions: Transaction[]) {
  const financialByMonth: Record<string, MonthlyData> = {};
  
  filteredTransactions.forEach(transaction => {
    const date = new Date(transaction.due_date);
    const monthKey = format(date, 'yyyy-MM');
    const monthLabel = format(date, 'MMM yyyy', { locale: ptBR });
    
    if (!financialByMonth[monthKey]) {
      financialByMonth[monthKey] = {
        month: monthLabel,
        revenue: 0,
        expenses: 0,
        profit: 0
      };
    }
    
    if (transaction.type === 'income') {
      financialByMonth[monthKey].revenue += Number(transaction.amount);
    } else {
      financialByMonth[monthKey].expenses += Number(transaction.amount);
    }
  });
  
  // Calculate profit for each month
  Object.keys(financialByMonth).forEach(key => {
    financialByMonth[key].profit = financialByMonth[key].revenue - financialByMonth[key].expenses;
  });
  
  return Object.values(financialByMonth).sort((a, b) => 
    new Date(a.month).getTime() - new Date(b.month).getTime()
  );
}

export function generateCSVContent(monthlyData: MonthlyData[]) {
  const headers = ['Mês', 'Receitas', 'Despesas', 'Lucro'];
  
  const rows = monthlyData.map(data => [
    data.month,
    data.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    data.expenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    data.profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  ]);
  
  let csvContent = headers.join(',') + '\n';
  csvContent += rows.map(row => row.join(',')).join('\n');
  
  return csvContent;
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.click();
  
  URL.revokeObjectURL(url);
}
