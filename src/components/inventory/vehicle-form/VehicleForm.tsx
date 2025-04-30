
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search } from "lucide-react";
import { PlateSearchDialog } from "@/components/license-plate/PlateSearchDialog";

const vehicleSchema = z.object({
  brand: z.string().min(1, "Marca é obrigatória"),
  model: z.string().min(1, "Modelo é obrigatório"),
  version: z.string().optional(),
  year: z.coerce.number().min(1900, "Ano inválido").max(new Date().getFullYear() + 1),
  color: z.string().min(1, "Cor é obrigatória"),
  plate: z.string().optional(),
  renavam: z.string().optional(),
  chassis: z.string().optional(),
  mileage: z.coerce.number().min(0, "Quilometragem inválida"),
  fuel: z.string().min(1, "Combustível é obrigatório"),
  transmission: z.string().min(1, "Transmissão é obrigatória"),
  purchase_price: z.coerce.number().min(0, "Preço de compra é obrigatório"),
  sale_price: z.coerce.number().min(0, "Preço de venda é obrigatório"),
  internal_notes: z.string().optional(),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  onSubmit: (data: VehicleFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<VehicleFormData>;
}

export function VehicleForm({ onSubmit, isLoading, initialData }: VehicleFormProps) {
  const [plateDialogOpen, setPlateDialogOpen] = useState(false);
  
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      brand: initialData?.brand || "",
      model: initialData?.model || "",
      version: initialData?.version || "",
      year: initialData?.year || new Date().getFullYear(),
      color: initialData?.color || "",
      plate: initialData?.plate || "",
      renavam: initialData?.renavam || "",
      chassis: initialData?.chassis || "",
      mileage: initialData?.mileage || 0,
      fuel: initialData?.fuel || "",
      transmission: initialData?.transmission || "",
      purchase_price: initialData?.purchase_price || 0,
      sale_price: initialData?.sale_price || 0,
      internal_notes: initialData?.internal_notes || "",
    },
  });

  const handleVehicleDataSelected = (data: Partial<VehicleFormData>) => {
    // Update form with data from API
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        form.setValue(key as keyof VehicleFormData, value);
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setPlateDialogOpen(true)}
              className="border-veloz-yellow text-veloz-yellow hover:bg-veloz-yellow hover:text-veloz-black"
            >
              <Search className="mr-2" size={16} />
              Buscar por Placa
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Toyota" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Corolla" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Versão</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: XEi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ano</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ex: 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Prata" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placa</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: ABC1234" 
                      className="uppercase"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chassis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chassis</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 9BWHE21JX24060960" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="renavam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Renavam</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 00123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quilometragem</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ex: 50000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fuel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Combustível</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Flex" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transmission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transmissão</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Automático" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purchase_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço de Compra</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Ex: 50000" 
                      prefix="R$" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sale_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço de Venda</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Ex: 55000" 
                      prefix="R$" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="internal_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações Internas</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Adicione notas ou observações sobre o veículo"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3">
            <Button
              type="submit"
              className="bg-veloz-yellow text-veloz-black hover:bg-opacity-90"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar Veículo"}
            </Button>
          </div>
        </form>
      </Form>

      <PlateSearchDialog
        open={plateDialogOpen}
        onOpenChange={setPlateDialogOpen}
        onDataSelected={handleVehicleDataSelected}
      />
    </>
  );
}
