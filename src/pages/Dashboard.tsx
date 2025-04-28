
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Car, DollarSign, TrendingUp, Calendar } from 'lucide-react';

const Dashboard = () => {
  // Dados fictícios para demonstração
  const estadisticas = [
    {
      title: "Veículos em estoque",
      value: "18",
      icon: <Car className="h-8 w-8 text-veloz-yellow" />,
      change: "+2 esta semana",
      trend: "up",
    },
    {
      title: "Vendas do Mês",
      value: "8",
      icon: <TrendingUp className="h-8 w-8 text-veloz-yellow" />,
      change: "+3 desde semana passada",
      trend: "up",
    },
    {
      title: "Lucro Mensal",
      value: "R$ 68.500",
      icon: <DollarSign className="h-8 w-8 text-veloz-yellow" />,
      change: "+12% do que mês passado",
      trend: "up",
    },
    {
      title: "Média Dias Estoque",
      value: "42",
      icon: <Calendar className="h-8 w-8 text-veloz-yellow" />,
      change: "-5 dias vs. média anterior",
      trend: "down",
    },
  ];

  const estoqueVeiculos = [
    { id: 1, marca: 'Toyota', modelo: 'Corolla', ano: '2022', valor: 'R$ 128.900', status: 'Em estoque', dias: 15 },
    { id: 2, marca: 'Honda', modelo: 'Civic', ano: '2021', valor: 'R$ 122.500', status: 'Em estoque', dias: 22 },
    { id: 3, marca: 'Volkswagen', modelo: 'Golf', ano: '2023', valor: 'R$ 145.900', status: 'Reservado', dias: 8 },
    { id: 4, marca: 'Hyundai', modelo: 'HB20', ano: '2022', valor: 'R$ 78.900', status: 'Em estoque', dias: 45 },
    { id: 5, marca: 'Chevrolet', modelo: 'Onix', ano: '2021', valor: 'R$ 72.900', status: 'Vendido', dias: 12 },
  ];

  const ultimasVendas = [
    { id: 1, veiculo: 'Jeep Compass', cliente: 'João Silva', valor: 'R$ 148.500', data: '22/04/2025' },
    { id: 2, veiculo: 'Ford Ranger', cliente: 'Maria Souza', valor: 'R$ 185.900', data: '18/04/2025' },
    { id: 3, veiculo: 'Fiat Toro', cliente: 'Carlos Mendes', valor: 'R$ 132.500', data: '15/04/2025' },
  ];

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
                  {estoqueVeiculos.map((veiculo) => (
                    <tr key={veiculo.id} className="border-b border-veloz-black hover:bg-veloz-black hover:bg-opacity-40 transition-colors">
                      <td className="py-3">{veiculo.marca} {veiculo.modelo}</td>
                      <td className="py-3">{veiculo.ano}</td>
                      <td className="py-3">{veiculo.valor}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          veiculo.status === 'Em estoque' ? 'bg-blue-900 text-blue-200' :
                          veiculo.status === 'Reservado' ? 'bg-amber-900 text-amber-200' : 
                          'bg-green-900 text-green-200'
                        }`}>
                          {veiculo.status}
                        </span>
                      </td>
                      <td className="py-3">{veiculo.dias}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <button className="btn-outline text-sm">Ver todos os veículos</button>
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
                  {ultimasVendas.map((venda) => (
                    <tr key={venda.id} className="border-b border-veloz-black hover:bg-veloz-black hover:bg-opacity-40 transition-colors">
                      <td className="py-3">{venda.veiculo}</td>
                      <td className="py-3">{venda.cliente}</td>
                      <td className="py-3">{venda.valor}</td>
                      <td className="py-3">{venda.data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <button className="btn-outline text-sm">Ver todas as vendas</button>
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
              <p className="text-sm">Veículos com mais de 60 dias em estoque têm 40% mais chances de sofrer desvalorização.</p>
            </div>
            <div className="bg-veloz-black rounded-lg p-4">
              <p className="font-medium mb-2 text-veloz-yellow">Lembrete</p>
              <p className="text-sm">Três veículos precisam de documentação atualizada esta semana.</p>
            </div>
            <div className="bg-veloz-black rounded-lg p-4">
              <p className="font-medium mb-2 text-veloz-yellow">Próximos vencimentos</p>
              <p className="text-sm">2 faturas vencem nos próximos 3 dias, totalizando R$ 15.450,00.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
