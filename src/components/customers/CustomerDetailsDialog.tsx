
// Fix for the undefined sale variable
<div className="flex flex-wrap gap-2 mt-4">
  <Badge className="bg-blue-600">Novo Cliente</Badge>
  <Badge className="bg-green-600">Cliente Ativo</Badge>
  {customerSales.length > 0 && customerSales[0].vehicle?.brand && (
    <Badge className="bg-purple-600">Comprador de {customerSales[0].vehicle.brand}</Badge>
  )}
</div>
