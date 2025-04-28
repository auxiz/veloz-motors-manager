import React, { useState } from 'react';
import { useVehicles } from '@/hooks/useVehicles';
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

const Estoque = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visualizacao, setVisualizacao] = useState<'lista' | 'cards'>('lista');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [novoVeiculoDialogOpen, setNovoVeiculoDialogOpen] = useState(false);
  
  const { vehicles, isLoading } = useVehicles();

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

  const filteredVeiculos = vehicles.filter(veiculo => 
    veiculo.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.plate?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Car className="h-12 w-12 text-veloz-yellow animate-pulse" />
          <p className="text-veloz-white text-lg">Carregando veículos...</p>
        </div>
      </div>
    );
  }

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
                    onClick={() => handleSort('brand')}
                  >
                    <div className="flex items-center">
                      Marca/Modelo {getSortIcon('brand')}
                    </div>
                  </TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Km</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('sale_price')}
                  >
                    <div className="flex items-center">
                      Valor {getSortIcon('sale_price')}
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
                      {veiculo.brand} {veiculo.model} {veiculo.version}
                    </TableCell>
                    <TableCell>{veiculo.year}</TableCell>
                    <TableCell>{veiculo.plate}</TableCell>
                    <TableCell>{veiculo.mileage.toLocaleString()}</TableCell>
                    <TableCell>{formatCurrency(veiculo.sale_price)}</TableCell>
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
                {veiculo.photos && veiculo.photos.length > 0 ? (
                  <img 
                    src={veiculo.photos[0]} 
                    alt={`${veiculo.brand} ${veiculo.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                    Sem Imagem
                  </div>
                )}
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
                      {veiculo.brand} {veiculo.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">{veiculo.version} • {veiculo.year}</p>
                  </div>
                  <p className="text-lg font-semibold text-veloz-yellow">
                    {formatCurrency(veiculo.sale_price)}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-1">Placa:</span>
                    <span>{veiculo.plate}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-1">Km:</span>
                    <span>{veiculo.mileage.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-1">Câmbio:</span>
                    <span>{veiculo.transmission}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-1">Combustível:</span>
                    <span>{veiculo.fuel}</span>
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
