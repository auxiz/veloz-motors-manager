
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Car, DollarSign, TrendingUp, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/utils';
import { Vehicle } from '@/hooks/useVehicles';
import { Sale } from '@/hooks/useSales';
import { Transaction } from '@/hooks/useTransactions';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    vehiclesInStock: 0,
    vehiclesInStockChange: 0,
    monthSales: 0,
    monthSalesChange: 0,
    monthProfit: 0,
    monthProfitChange: 0,
    averageDaysInStock: 0,
    averageDaysChange: 0,
    latestVehicles: [] as Vehicle[],
    latestSales: [] as Sale[],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch vehicles in stock
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from('vehicles')
          .select('*')
          .eq('status', 'in_stock');
          
        if (vehiclesError) throw vehiclesError;
        
        // Fetch vehicles in stock from last week for comparison
        const lastWeekDate = new Date();
        lastWeekDate.setDate(lastWeekDate.getDate() - 7);
        const { count: lastWeekCount, error: lastWeekError } = await supabase
          .from('vehicles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'in_stock')
          .lt('created_at', lastWeekDate.toISOString());
          
        if (lastWeekError) throw lastWeekError;
        
        // Fetch sales from current month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const { data: salesData, error: salesError } = await supabase
          .from('sales')
          .select('*, vehicle:vehicles(*), customer:customers(*)')
          .gte('created_at', startOfMonth.toISOString());
          
        if (salesError) throw salesError;
        
        // Fetch sales from previous month for comparison
        const startOfLastMonth = new Date(startOfMonth);
        startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
        const endOfLastMonth = new Date(startOfMonth);
        endOfLastMonth.setDate(0);
        
        const { data: lastMonthSales, error: lastMonthSalesError } = await supabase
          .from('sales')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfLastMonth.toISOString())
          .lte('created_at', endOfLastMonth.toISOString());
          
        if (lastMonthSalesError) throw lastMonthSalesError;
        
        // Fetch financial transactions for profit calculation
        const { data: incomeData, error: incomeError } = await supabase
          .from('financial_transactions')
          .select('amount')
          .eq('type', 'income')
          .gte('created_at', startOfMonth.toISOString());
          
        if (incomeError) throw incomeError;
        
        const { data: expenseData, error: expenseError } = await supabase
          .from('financial_transactions')
          .select('amount')
          .eq('type', 'expense')
          .gte('created_at', startOfMonth.toISOString());
          
        if (expenseError) throw expenseError;
        
        // Calculate profit for this month
        const totalIncome = incomeData.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
        const totalExpense = expenseData.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
        const profit = totalIncome - totalExpense;
        
        // Fetch profit from last month for comparison
        const { data: lastMonthIncomeData, error: lastMonthIncomeError } = await supabase
          .from('financial_transactions')
          .select('amount')
          .eq('type', 'income')
          .gte('created_at', startOfLastMonth.toISOString())
          .lte('created_at', endOfLastMonth.toISOString());
          
        if (lastMonthIncomeError) throw lastMonthIncomeError;
        
        const { data: lastMonthExpenseData, error: lastMonthExpenseError } = await supabase
          .from('financial_transactions')
          .select('amount')
          .eq('type', 'expense')
          .gte('created_at', startOfLastMonth.toISOString())
          .lte('created_at', endOfLastMonth.toISOString());
          
        if (lastMonthExpenseError) throw lastMonthExpenseError;
        
        const lastMonthIncome = lastMonthIncomeData.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
        const lastMonthExpense = lastMonthExpenseData.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
        const lastMonthProfit = lastMonthIncome - lastMonthExpense;
        
        // Calculate average days in stock for sold vehicles
        const { data: soldVehiclesData, error: soldVehiclesError } = await supabase
          .from('vehicles')
          .select('entry_date, updated_at')
          .eq('status', 'sold');
          
        if (soldVehiclesError) throw soldVehiclesError;
        
        let totalDays = 0;
        let vehicleCount = 0;
        
        soldVehiclesData.forEach(vehicle => {
          if (vehicle.entry_date && vehicle.updated_at) {
            const entryDate = new Date(vehicle.entry_date);
            const soldDate = new Date(vehicle.updated_at);
            const daysDiff = Math.floor((soldDate.getTime() - entryDate.getTime()) / (1000 * 3600 * 24));
            if (daysDiff > 0) {
              totalDays += daysDiff;
              vehicleCount++;
            }
          }
        });
        
        const avgDays = vehicleCount > 0 ? Math.floor(totalDays / vehicleCount) : 0;
        
        // Previous average days in stock (using vehicles sold more than a month ago)
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        
        const { data: previousSoldVehicles, error: previousSoldError } = await supabase
          .from('vehicles')
          .select('entry_date, updated_at')
          .eq('status', 'sold')
          .lt('updated_at', monthAgo.toISOString());
          
        if (previousSoldError) throw previousSoldError;
        
        let previousTotalDays = 0;
        let previousVehicleCount = 0;
        
        previousSoldVehicles.forEach(vehicle => {
          if (vehicle.entry_date && vehicle.updated_at) {
            const entryDate = new Date(vehicle.entry_date);
            const soldDate = new Date(vehicle.updated_at);
            const daysDiff = Math.floor((soldDate.getTime() - entryDate.getTime()) / (1000 * 3600 * 24));
            if (daysDiff > 0) {
              previousTotalDays += daysDiff;
              previousVehicleCount++;
            }
          }
        });
        
        const previousAvgDays = previousVehicleCount > 0 ? Math.floor(previousTotalDays / previousVehicleCount) : 0;
        
        // Fetch latest vehicles in stock
        const { data: latestVehicles, error: latestVehiclesError } = await supabase
          .from('vehicles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (latestVehiclesError) throw latestVehiclesError;
        
        // Fetch latest sales
        const { data: latestSales, error: latestSalesError } = await supabase
          .from('sales')
          .select(`
            id,
            final_price,
            sale_date,
            vehicle:vehicles(brand, model, year),
            customer:customers(name)
          `)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (latestSalesError) throw latestSalesError;
        
        setDashboardData({
          vehiclesInStock: vehiclesData.length,
          vehiclesInStockChange: vehiclesData.length - (lastWeekCount || 0),
          monthSales: salesData.length,
          monthSalesChange: salesData.length - (lastMonthSales?.length || 0),
          monthProfit: profit,
          monthProfitChange: ((profit - lastMonthProfit) / (lastMonthProfit || 1)) * 100,
          averageDaysInStock: avgDays,
          averageDaysChange: previousAvgDays > 0 ? avgDays - previousAvgDays : 0,
          latestVehicles: latestVehicles,
          latestSales: latestSales as Sale[],
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Set up real-time subscription for changes
    const vehiclesSubscription = supabase
      .channel('public:vehicles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, () => {
        fetchDashboardData();
      })
      .subscribe();
      
    const salesSubscription = supabase
      .channel('public:sales')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sales' }, () => {
        fetchDashboardData();
      })
      .subscribe();
      
    const transactionsSubscription = supabase
      .channel('public:financial_transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financial_transactions' }, () => {
        fetchDashboardData();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(vehiclesSubscription);
      supabase.removeChannel(salesSubscription);
      supabase.removeChannel(transactionsSubscription);
    };
  }, []);

  // Generate a random tip from the list of tips
  const tips = [
    "Veículos com mais de 60 dias em estoque têm 40% mais chances de sofrer desvalorização.",
    "Carros das cores branco, prata e preto tendem a ser vendidos 25% mais rápido.",
    "Agende inspeções regulares nos veículos em estoque para evitar problemas na hora da venda.",
    "Atualizar fotos dos veículos periodicamente pode aumentar o interesse dos clientes.",
    "Ofereça test drives para clientes potenciais para aumentar as chances de venda.",
    "Mantenha os documentos dos veículos organizados e atualizados."
  ];
  
  // Get a random tip
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  
  // Generate random reminders
  const reminders = [
    "Três veículos precisam de documentação atualizada esta semana.",
    "Fazer revisão de preços dos veículos com mais de 45 dias em estoque.",
    "Reunião com fornecedores agendada para amanhã.",
    "Atualizar cadastro de clientes antigos.",
    "Renovar seguro da loja."
  ];
  
  // Get a random reminder
  const randomReminder = reminders[Math.floor(Math.random() * reminders.length)];

  // Calculate due dates for transactions
  const dueDate = async () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('status', 'pending')
      .lte('due_date', nextWeek.toISOString())
      .gte('due_date', today.toISOString())
      .order('due_date', { ascending: true });
      
    if (error) {
      console.error('Error fetching due dates:', error);
      return "Nenhum vencimento próximo.";
    }
    
    if (data && data.length > 0) {
      const totalAmount = data.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
      return `${data.length} faturas vencem nos próximos 7 dias, totalizando ${formatCurrency(totalAmount)}.`;
    }
    
    return "Nenhum vencimento próximo.";
  };
  
  const [dueDateMessage, setDueDateMessage] = useState("Carregando vencimentos...");
  
  useEffect(() => {
    dueDate().then(setDueDateMessage);
  }, []);

  const estadisticas = [
    {
      title: "Veículos em estoque",
      value: isLoading ? "..." : dashboardData.vehiclesInStock.toString(),
      icon: <Car className="h-8 w-8 text-veloz-yellow" />,
      change: isLoading ? "..." : `${dashboardData.vehiclesInStockChange >= 0 ? '+' : ''}${dashboardData.vehiclesInStockChange} esta semana`,
      trend: dashboardData.vehiclesInStockChange >= 0 ? "up" : "down",
    },
    {
      title: "Vendas do Mês",
      value: isLoading ? "..." : dashboardData.monthSales.toString(),
      icon: <TrendingUp className="h-8 w-8 text-veloz-yellow" />,
      change: isLoading ? "..." : `${dashboardData.monthSalesChange >= 0 ? '+' : ''}${dashboardData.monthSalesChange} vs. mês anterior`,
      trend: dashboardData.monthSalesChange >= 0 ? "up" : "down",
    },
    {
      title: "Lucro Mensal",
      value: isLoading ? "..." : formatCurrency(dashboardData.monthProfit),
      icon: <DollarSign className="h-8 w-8 text-veloz-yellow" />,
      change: isLoading ? "..." : `${dashboardData.monthProfitChange >= 0 ? '+' : ''}${Math.abs(Math.round(dashboardData.monthProfitChange))}% vs. mês anterior`,
      trend: dashboardData.monthProfitChange >= 0 ? "up" : "down",
    },
    {
      title: "Média Dias Estoque",
      value: isLoading ? "..." : dashboardData.averageDaysInStock.toString(),
      icon: <Calendar className="h-8 w-8 text-veloz-yellow" />,
      change: isLoading ? "..." : `${dashboardData.averageDaysChange <= 0 ? '-' : '+'}${Math.abs(dashboardData.averageDaysChange)} dias vs. média anterior`,
      trend: dashboardData.averageDaysChange <= 0 ? "up" : "down", // Lower is better for days in stock
    },
  ];
  
  const calculateDaysInStock = (vehicle: Vehicle) => {
    if (!vehicle.entry_date) return 0;
    const entryDate = new Date(vehicle.entry_date);
    const today = new Date();
    return Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 3600 * 24));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu negócio</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {estadisticas.map((stat, index) => (
          <Card key={index} className="bg-veloz-gray border-veloz-gray card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold text-veloz-white">{stat.value}</h3>
                  </div>
                  <p className={`text-xs mt-2 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-veloz-black bg-opacity-30">{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-veloz-gray border-veloz-gray">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Car className="h-5 w-5 mr-2 text-veloz-yellow" />
              Veículos em Estoque
            </CardTitle>
            <CardDescription>Monitoramento dos últimos veículos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex justify-center py-8">Carregando veículos...</div>
              ) : dashboardData.latestVehicles.length === 0 ? (
                <div className="text-center py-8">Nenhum veículo em estoque</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-veloz-black">
                      <th className="text-left py-3 font-medium">Marca/Modelo</th>
                      <th className="text-left py-3 font-medium">Ano</th>
                      <th className="text-left py-3 font-medium">Valor</th>
                      <th className="text-left py-3 font-medium">Status</th>
                      <th className="text-left py-3 font-medium">Dias</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.latestVehicles.map((veiculo) => (
                      <tr key={veiculo.id} className="border-b border-veloz-black hover:bg-veloz-black hover:bg-opacity-40 transition-colors">
                        <td className="py-3">{veiculo.brand} {veiculo.model}</td>
                        <td className="py-3">{veiculo.year}</td>
                        <td className="py-3">{formatCurrency(veiculo.sale_price)}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            veiculo.status === 'in_stock' ? 'bg-blue-900 text-blue-200' :
                            veiculo.status === 'reserved' ? 'bg-amber-900 text-amber-200' : 
                            'bg-green-900 text-green-200'
                          }`}>
                            {veiculo.status === 'in_stock' ? 'Em estoque' :
                             veiculo.status === 'reserved' ? 'Reservado' : 'Vendido'}
                          </span>
                        </td>
                        <td className="py-3">{calculateDaysInStock(veiculo)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                className="text-sm"
                onClick={() => navigate('/estoque')}
              >
                Ver todos os veículos
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-veloz-gray border-veloz-gray">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-veloz-yellow" />
              Últimas Vendas
            </CardTitle>
            <CardDescription>Vendas realizadas recentemente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex justify-center py-8">Carregando vendas...</div>
              ) : dashboardData.latestSales.length === 0 ? (
                <div className="text-center py-8">Nenhuma venda registrada</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-veloz-black">
                      <th className="text-left py-3 font-medium">Veículo</th>
                      <th className="text-left py-3 font-medium">Cliente</th>
                      <th className="text-left py-3 font-medium">Valor</th>
                      <th className="text-left py-3 font-medium">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.latestSales.map((venda) => (
                      <tr key={venda.id} className="border-b border-veloz-black hover:bg-veloz-black hover:bg-opacity-40 transition-colors">
                        <td className="py-3">{venda.vehicle?.brand} {venda.vehicle?.model}</td>
                        <td className="py-3">{venda.customer?.name}</td>
                        <td className="py-3">{formatCurrency(venda.final_price)}</td>
                        <td className="py-3">{new Date(venda.sale_date!).toLocaleDateString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                className="text-sm"
                onClick={() => navigate('/vendas')}
              >
                Ver todas as vendas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-veloz-gray border-veloz-gray">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-veloz-yellow p-2">
              <Car className="h-6 w-6 text-veloz-black" />
            </div>
            <div>
              <h3 className="font-bold">Veloz Motors</h3>
              <p className="text-sm text-muted-foreground">Gerenciamento de Revenda de Veículos</p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-veloz-black rounded-lg p-4">
              <p className="font-medium mb-2 text-veloz-yellow">Dica do dia</p>
              <p className="text-sm">{randomTip}</p>
            </div>
            <div className="bg-veloz-black rounded-lg p-4">
              <p className="font-medium mb-2 text-veloz-yellow">Lembrete</p>
              <p className="text-sm">{randomReminder}</p>
            </div>
            <div className="bg-veloz-black rounded-lg p-4">
              <p className="font-medium mb-2 text-veloz-yellow">Próximos vencimentos</p>
              <p className="text-sm">{dueDateMessage}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
