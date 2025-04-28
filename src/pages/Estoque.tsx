
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Car, Search, Filter, Plus, ChevronDown, ChevronUp, Edit, Trash 
} from 'lucide-react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Dados fictícios para demonstração
const veiculosMock = [
  { 
    id: 1, 
    marca: 'Toyota', 
    modelo: 'Corolla', 
    versao: 'XEi', 
    ano: '2022', 
    placa: 'ABC-1234', 
    cor: 'Preto', 
    km: 45000, 
    combustivel: 'Flex', 
    cambio: 'Automático', 
    valor_compra: 120000, 
    valor_venda: 128900, 
    status: 'Em estoque', 
    data_entrada: '10/03/2025',
    imagem: 'https://images.prd.kavak.io/eyJidWNrZXQiOiJrYXZhay1pbWFnZXMiLCJrZXkiOiJici9wcm9kdWN0LzI4Mzk4LW1haW4tNTM5NmExNzMwNGQyOGIwZWU1OTYuanBnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo2NDAsImhlaWdodCI6NDgwLCJmaXQiOiJjb250YWluIiwiYmFja2dyb3VuZCI6eyJyIjoyNTUsImciOjI1NSwiYiI6MjU1LCJhbHBoYSI6MX19fX0=' 
  },
  { 
    id: 2, 
    marca: 'Honda', 
    modelo: 'Civic', 
    versao: 'EXL', 
    ano: '2021', 
    placa: 'DEF-5678', 
    cor: 'Branco', 
    km: 32000, 
    combustivel: 'Flex', 
    cambio: 'Automático', 
    valor_compra: 115000, 
    valor_venda: 122500, 
    status: 'Em estoque', 
    data_entrada: '15/03/2025',
    imagem: 'https://images.prd.kavak.io/eyJidWNrZXQiOiJrYXZhay1pbWFnZXMiLCJrZXkiOiJici9wcm9kdWN0LzM0NTItb3JpZy0wZDI3ZTc3OTliYTRlZGU2ZTBmOC5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjY0MCwiaGVpZ2h0Ijo0ODAsImZpdCI6ImNvbnRhaW4iLCJiYWNrZ3JvdW5kIjp7InIiOjI1NSwiZyI6MjU1LCJiIjoyNTUsImFscGhhIjoxfX19fQ==' 
  },
  { 
    id: 3, 
    marca: 'Volkswagen', 
    modelo: 'Golf', 
    versao: 'GTI', 
    ano: '2023', 
    placa: 'GHI-9012', 
    cor: 'Azul', 
    km: 15000, 
    combustivel: 'Flex', 
    cambio: 'Automático', 
    valor_compra: 137000, 
    valor_venda: 145900, 
    status: 'Reservado', 
    data_entrada: '20/02/2025',
    imagem: 'https://images.prd.kavak.io/eyJidWNrZXQiOiJrYXZhay1pbWFnZXMiLCJrZXkiOiJici9wcm9kdWN0LzExMTY4LW9yaWctNGY3YTJiN2E2MWQ0Y2E4OTA0ZTkuanBnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo2NDAsImhlaWdodCI6NDgwLCJmaXQiOiJjb250YWluIiwiYmFja2dyb3VuZCI6eyJyIjoyNTUsImciOjI1NSwiYiI6MjU1LCJhbHBoYSI6MX19fX0=' 
  },
  { 
    id: 4, 
    marca: 'Hyundai', 
    modelo: 'HB20', 
    versao: 'Premium', 
    ano: '2022', 
    placa: 'JKL-3456', 
    cor: 'Prata', 
    km: 28000, 
    combustivel: 'Flex', 
    cambio: 'Manual', 
    valor_compra: 72000, 
    valor_venda: 78900, 
    status: 'Em estoque', 
    data_entrada: '05/04/2025',
    imagem: 'https://images.prd.kavak.io/eyJidWNrZXQiOiJrYXZhay1pbWFnZXMiLCJrZXkiOiIyMDIzLzA5LzI3L2M4ZmY1NGEwNGE0MjRiMDFiM2RmZTU2NDk3MDJiNDI2NjgwZDFkN2QtMTIzNC1vcmlnLnBuZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6NjQwLCJoZWlnaHQiOjQ4MCwiZml0IjoiY29udGFpbiIsImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjF9fX19' 
  },
  { 
    id: 5, 
    marca: 'Chevrolet', 
    modelo: 'Onix', 
    versao: 'LTZ', 
    ano: '2021', 
    placa: 'MNO-7890', 
    cor: 'Vermelho', 
    km: 39000, 
    combustivel: 'Flex', 
    cambio: 'Manual', 
    valor_compra: 67000, 
    valor_venda: 72900, 
    status: 'Vendido', 
    data_entrada: '15/01/2025',
    imagem: 'https://images.prd.kavak.io/eyJidWNrZXQiOiJrYXZhay1pbWFnZXMiLCJrZXkiOiJici9wcm9kdWN0LzIyMjI1LW1haW4tZDRlOGNhOGQ5ZGY3ZDQ1MjU3MjEuanBnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo2NDAsImhlaWdodCI6NDgwLCJmaXQiOiJjb250YWluIiwiYmFja2dyb3VuZCI6eyJyIjoyNTUsImciOjI1NSwiYiI6MjU1LCJhbHBoYSI6MX19fX0=' 
  },
];

const Estoque = () => {
  const [veiculos, setVeiculos] = useState(veiculosMock);
  const [visualizacao, setVisualizacao] = useState<'lista' | 'cards'>('lista');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [novoVeiculoDialogOpen, setNovoVeiculoDialogOpen] = useState(false);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  const filteredVeiculos = veiculos.filter(veiculo => 
    veiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Estoque de Veículos</h1>
          <p className="text-muted-foreground">Gerencie seu inventário de veículos</p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className={`px-3 ${visualizacao === 'lista' ? 'bg-veloz-yellow text-veloz-black' : 'border-veloz-gray text-veloz-white'}`} 
            onClick={() => setVisualizacao('lista')}
          >
            Lista
          </Button>
          <Button 
            variant="outline" 
            className={`px-3 ${visualizacao === 'cards' ? 'bg-veloz-yellow text-veloz-black' : 'border-veloz-gray text-veloz-white'}`} 
            onClick={() => setVisualizacao('cards')}
          >
            Cards
          </Button>
          <Button 
            className="bg-veloz-yellow text-veloz-black hover:bg-opacity-90"
            onClick={() => setNovoVeiculoDialogOpen(true)}
          >
            <Plus size={18} className="mr-2" /> Novo Veículo
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar por marca, modelo ou placa..."
              className="pl-10 bg-veloz-gray border-veloz-gray"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="col-span-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full border-veloz-gray text-veloz-white">
                <Filter size={18} className="mr-2" /> Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Todos os veículos</DropdownMenuItem>
              <DropdownMenuItem>Em estoque</DropdownMenuItem>
              <DropdownMenuItem>Reservados</DropdownMenuItem>
              <DropdownMenuItem>Vendidos</DropdownMenuItem>
              <DropdownMenuItem>Consignados</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {visualizacao === 'lista' ? (
        <Card className="bg-veloz-gray border-veloz-gray">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort('marca')}
                  >
                    <div className="flex items-center">
                      Marca/Modelo {getSortIcon('marca')}
                    </div>
                  </TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Km</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('valor_venda')}
                  >
                    <div className="flex items-center">
                      Valor {getSortIcon('valor_venda')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status {getSortIcon('status')}
                    </div>
                  </TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVeiculos.map((veiculo) => (
                  <TableRow key={veiculo.id} className="hover:bg-veloz-black">
                    <TableCell className="font-medium">
                      {veiculo.marca} {veiculo.modelo} {veiculo.versao}
                    </TableCell>
                    <TableCell>{veiculo.ano}</TableCell>
                    <TableCell>{veiculo.placa}</TableCell>
                    <TableCell>{veiculo.km.toLocaleString()}</TableCell>
                    <TableCell>{formatCurrency(veiculo.valor_venda)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        veiculo.status === 'Em estoque' ? 'bg-blue-900 text-blue-200' :
                        veiculo.status === 'Reservado' ? 'bg-amber-900 text-amber-200' : 
                        veiculo.status === 'Vendido' ? 'bg-green-900 text-green-200' :
                        'bg-purple-900 text-purple-200'
                      }`}>
                        {veiculo.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-veloz-gray">
                          <Edit size={16} />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-veloz-gray">
                          <Trash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVeiculos.map((veiculo) => (
            <Card key={veiculo.id} className="overflow-hidden bg-veloz-gray border-veloz-gray card-hover">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={veiculo.imagem} 
                  alt={`${veiculo.marca} ${veiculo.modelo}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 m-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    veiculo.status === 'Em estoque' ? 'bg-blue-900 text-blue-200' :
                    veiculo.status === 'Reservado' ? 'bg-amber-900 text-amber-200' : 
                    veiculo.status === 'Vendido' ? 'bg-green-900 text-green-200' :
                    'bg-purple-900 text-purple-200'
                  }`}>
                    {veiculo.status}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">
                      {veiculo.marca} {veiculo.modelo}
                    </h3>
                    <p className="text-sm text-muted-foreground">{veiculo.versao} • {veiculo.ano}</p>
                  </div>
                  <p className="text-lg font-semibold text-veloz-yellow">
                    {formatCurrency(veiculo.valor_venda)}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-1">Placa:</span>
                    <span>{veiculo.placa}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-1">Km:</span>
                    <span>{veiculo.km.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-1">Câmbio:</span>
                    <span>{veiculo.cambio}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-1">Combustível:</span>
                    <span>{veiculo.combustivel}</span>
                  </div>
                </div>
                
                <div className="border-t border-veloz-black mt-4 pt-4 flex justify-between">
                  <Button variant="outline" size="sm" className="border-veloz-yellow text-veloz-yellow hover:bg-veloz-yellow hover:text-veloz-black">
                    <Edit size={16} className="mr-2" /> Editar
                  </Button>
                  <Button variant="outline" size="sm" className="border-veloz-gray text-veloz-white">
                    Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Modal para Novo Veículo */}
      <Dialog open={novoVeiculoDialogOpen} onOpenChange={setNovoVeiculoDialogOpen}>
        <DialogContent className="bg-veloz-gray border-veloz-gray max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Novo Veículo</DialogTitle>
            <DialogDescription>
              Preencha os dados do veículo para adicioná-lo ao estoque.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Formulário será implementado posteriormente com Supabase */}
            <p className="col-span-1 md:col-span-2 text-center text-muted-foreground">
              O formulário completo será implementado em uma próxima etapa com integração ao Supabase.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" className="border-veloz-gray text-veloz-white" onClick={() => setNovoVeiculoDialogOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-veloz-yellow text-veloz-black hover:bg-opacity-90">
              Salvar Veículo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Estoque;
