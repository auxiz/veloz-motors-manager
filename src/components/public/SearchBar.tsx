
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const SearchBar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    brand: '',
    model: '',
    minYear: '',
    maxYear: '',
    minPrice: '',
    maxPrice: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearch(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    if (search.brand) params.append('brand', search.brand);
    if (search.model) params.append('model', search.model);
    if (search.minYear) params.append('minYear', search.minYear);
    if (search.maxYear) params.append('maxYear', search.maxYear);
    if (search.minPrice) params.append('minPrice', search.minPrice);
    if (search.maxPrice) params.append('maxPrice', search.maxPrice);
    
    navigate(`/veiculos?${params.toString()}`);
  };
  
  return (
    <div className="bg-veloz-gray p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-montserrat font-semibold mb-4 text-white">Encontre seu veículo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="brand">Marca</Label>
            <Input 
              id="brand"
              name="brand"
              placeholder="Ex: Toyota, Honda..."
              value={search.brand}
              onChange={handleChange}
              className="bg-veloz-black text-white border-veloz-gray"
            />
          </div>
          <div>
            <Label htmlFor="model">Modelo</Label>
            <Input 
              id="model"
              name="model"
              placeholder="Ex: Corolla, Civic..."
              value={search.model}
              onChange={handleChange}
              className="bg-veloz-black text-white border-veloz-gray"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="minYear">Ano (min)</Label>
              <Input 
                id="minYear"
                name="minYear"
                type="number"
                placeholder="Ex: 2018"
                value={search.minYear}
                onChange={handleChange}
                className="bg-veloz-black text-white border-veloz-gray"
              />
            </div>
            <div>
              <Label htmlFor="maxYear">Ano (max)</Label>
              <Input 
                id="maxYear"
                name="maxYear"
                type="number"
                placeholder="Ex: 2023"
                value={search.maxYear}
                onChange={handleChange}
                className="bg-veloz-black text-white border-veloz-gray"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="minPrice">Preço (min)</Label>
              <Input 
                id="minPrice"
                name="minPrice"
                type="number"
                placeholder="R$ mínimo"
                value={search.minPrice}
                onChange={handleChange}
                className="bg-veloz-black text-white border-veloz-gray"
              />
            </div>
            <div>
              <Label htmlFor="maxPrice">Preço (max)</Label>
              <Input 
                id="maxPrice"
                name="maxPrice"
                type="number"
                placeholder="R$ máximo"
                value={search.maxPrice}
                onChange={handleChange}
                className="bg-veloz-black text-white border-veloz-gray"
              />
            </div>
          </div>
        </div>
        <button type="submit" className="w-full btn-primary">
          <Search size={18} />
          Buscar Veículos
        </button>
      </form>
    </div>
  );
};
