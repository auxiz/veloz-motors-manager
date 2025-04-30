
import React from 'react';
import { useFinancialData } from '@/hooks/reports/useFinancialData';
import { FinancialSummaryCards } from './financial/FinancialSummaryCards';
import { FinancialOverviewChart } from './financial/FinancialOverviewChart';
import { ExpensesByCategoryTable } from './financial/ExpensesByCategoryTable';
import { MonthlySummaryTable } from './financial/MonthlySummaryTable';

interface FinancialReportsProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

export function FinancialReports({ dateRange }: FinancialReportsProps) {
  // Use our new hook to handle all data processing
  const { 
    totalRevenue, 
    totalExpenses, 
    profit,
    categoryData,
    monthlyData,
    downloadCSV
  } = useFinancialData({ dateRange });

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
        onDownloadCSV={downloadCSV}
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
