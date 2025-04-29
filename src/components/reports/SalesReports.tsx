
import React, { useState } from 'react';
import { useSales } from '@/hooks/useSales';
import { useVehicles } from '@/hooks/useVehicles';
import { useUsers } from '@/hooks/useUsers';

// Import refactored components
import { SalesSummaryCards } from './sales/SalesSummaryCards';
import { SalesFilterBar } from './sales/SalesFilterBar';
import { SalesChart } from './sales/SalesChart';
import { SalesDetailsTable } from './sales/SalesDetailsTable';
import { filterSales, generateChartData, createDownloadCSV } from './sales/utils';

interface SalesReportsProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

export function SalesReports({ dateRange }: SalesReportsProps) {
  const { sales, isLoading: isLoadingSales } = useSales();
  const { vehicles } = useVehicles();
  const { users } = useUsers();
  
  const [periodType, setPeriodType] = useState<'day' | 'week' | 'month'>('month');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedSeller, setSelectedSeller] = useState<string>('all');

  // Get unique brands from vehicles
  const brands = [...new Set(vehicles.map(vehicle => vehicle.brand))];
  
  // Filter sales by date range and other filters
  const filteredSales = filterSales(sales, dateRange, selectedBrand, selectedSeller, vehicles);

  // Generate chart data based on period type
  const chartData = generateChartData(filteredSales, periodType);

  // Calculate total sales and amount
  const totalSales = filteredSales.length;
  const totalAmount = filteredSales.reduce((sum, sale) => sum + Number(sale.final_price), 0);

  // Download as CSV function
  const downloadCSV = createDownloadCSV(filteredSales, vehicles, users);

  // Loading state
  if (isLoadingSales) {
    return <div>Carregando dados de vendas...</div>;
  }

  // Filter bar component for use in the chart
  const filterBar = (
    <SalesFilterBar
      periodType={periodType}
      setPeriodType={setPeriodType}
      selectedBrand={selectedBrand}
      setSelectedBrand={setSelectedBrand}
      selectedSeller={selectedSeller}
      setSelectedSeller={setSelectedSeller}
      brands={brands}
      users={users}
    />
  );

  return (
    <div className="space-y-6">
      <SalesSummaryCards 
        totalSales={totalSales} 
        totalAmount={totalAmount} 
      />

      <SalesChart 
        chartData={chartData} 
        filterBar={filterBar} 
      />

      <SalesDetailsTable 
        filteredSales={filteredSales}
        allSalesCount={sales.length}
        vehicles={vehicles}
        users={users}
        downloadCSV={downloadCSV}
      />
    </div>
  );
}
