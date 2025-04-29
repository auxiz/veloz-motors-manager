
import React from 'react';
import { useSales } from '@/hooks/useSales';
import { useUsers } from '@/hooks/useUsers';
import { useVehicles } from '@/hooks/useVehicles';
import { isWithinInterval } from 'date-fns';

// Import refactored components
import { SummaryCards } from './performance/SummaryCards';
import { PerformanceChart } from './performance/PerformanceChart';
import { SellersRankingTable } from './performance/SellersRankingTable';
import { SalesDetailsTable } from './performance/SalesDetailsTable';
import { calculatePerformanceData, prepareChartData, createDownloadCSV } from './performance/utils';

interface SalesPerformanceReportsProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

export function SalesPerformanceReports({ dateRange }: SalesPerformanceReportsProps) {
  const { sales } = useSales();
  const { users } = useUsers();
  const { vehicles } = useVehicles();
  
  // Filter sales by date range
  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.sale_date);
    return isWithinInterval(saleDate, {
      start: dateRange.from,
      end: dateRange.to
    });
  });
  
  // Process sales data
  const performanceData = calculatePerformanceData(filteredSales, users);
  const chartData = prepareChartData(performanceData);
  const downloadCSV = createDownloadCSV(performanceData);

  // Calculate totals
  const totalSalesAmount = performanceData.reduce((total, user) => total + user.totalSales, 0);
  const totalCommissions = performanceData.reduce((total, user) => total + user.totalCommission, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards Component */}
      <SummaryCards 
        performanceData={performanceData}
        totalSalesAmount={totalSalesAmount}
        totalCommissions={totalCommissions}
      />

      {/* Performance Chart Component */}
      <PerformanceChart 
        chartData={chartData} 
        downloadCSV={downloadCSV} 
      />

      {/* Sellers Ranking Table Component */}
      <SellersRankingTable performanceData={performanceData} />

      {/* Sales Details Table Component */}
      <SalesDetailsTable 
        filteredSales={filteredSales}
        users={users}
        vehicles={vehicles}
      />
    </div>
  );
}
