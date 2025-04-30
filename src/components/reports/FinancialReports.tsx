
import React from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { format } from 'date-fns';
import { FinancialSummaryCards } from './financial/FinancialSummaryCards';
import { FinancialOverviewChart } from './financial/FinancialOverviewChart';
import { ExpensesByCategoryTable } from './financial/ExpensesByCategoryTable';
import { MonthlySummaryTable } from './financial/MonthlySummaryTable';
import { 
  filterTransactionsByDateRange,
  calculateTotals,
  getExpensesByCategory,
  getFinancialDataByMonth,
  generateCSVContent,
  downloadCSV
} from './financial/financial-utils';

interface FinancialReportsProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

export function FinancialReports({ dateRange }: FinancialReportsProps) {
  const { transactions } = useTransactions();
  
  // Filter transactions by date range
  const filteredTransactions = filterTransactionsByDateRange(transactions, dateRange);
  
  // Calculate totals
  const { totalRevenue, totalExpenses, profit } = calculateTotals(filteredTransactions);
  
  // Get expenses by category
  const categoryData = getExpensesByCategory(filteredTransactions);
  
  // Get financial data by month
  const monthlyData = getFinancialDataByMonth(filteredTransactions);
  
  // Download as CSV
  const handleDownloadCSV = () => {
    const csvContent = generateCSVContent(monthlyData);
    downloadCSV(csvContent, `relatorio-financeiro-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <FinancialSummaryCards 
        totalRevenue={totalRevenue}
        totalExpenses={totalExpenses}
        profit={profit}
      />

      {/* Financial Overview Chart */}
      <FinancialOverviewChart 
        monthlyData={monthlyData}
        onDownloadCSV={handleDownloadCSV}
      />

      {/* Details Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories Table */}
        <ExpensesByCategoryTable 
          categoryData={categoryData}
          totalExpenses={totalExpenses}
        />

        {/* Monthly Summary Table */}
        <MonthlySummaryTable monthlyData={monthlyData} />
      </div>
    </div>
  );
}
