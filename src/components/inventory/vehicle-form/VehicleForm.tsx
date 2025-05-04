
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PlateSearchDialog } from "@/components/license-plate/PlateSearchDialog";
import { vehicleSchema, VehicleFormData } from "./VehicleFormSchema";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { IdentificationFields } from "./fields/IdentificationFields";
import { SpecificationsFields } from "./fields/SpecificationsFields";
import { PricingFields } from "./fields/PricingFields";
import { NotesField } from "./fields/NotesField";
import { PlateSearchButton } from "./PlateSearchButton";
import { usePlateSearch } from "./hooks/usePlateSearch";
import { PhotosField } from "./fields/PhotosField";
import { StatusField } from "./fields/StatusField";
import { InvestorAccessField } from "./fields/InvestorAccessField";
import { useUsers } from "@/hooks/useUsers";

interface VehicleFormProps {
  onSubmit: (data: VehicleFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<VehicleFormData>;
  vehicleId?: string;
}

export type { VehicleFormData } from "./VehicleFormSchema";

export function VehicleForm({ onSubmit, isLoading, initialData, vehicleId }: VehicleFormProps) {
  const { user } = useUsers();
  const isAdmin = user?.profile?.role === 'administrator';
  
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
      photos: initialData?.photos || [],
      status: initialData?.status || "in_stock",
      investorAccess: initialData?.investorAccess || [],
    },
  });

  const { plateDialogOpen, setPlateDialogOpen, handleVehicleDataSelected } = usePlateSearch(form);

  const handleFormSubmit = (data: VehicleFormData) => {
    onSubmit(data);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="flex justify-end">
            <PlateSearchButton onClick={() => setPlateDialogOpen(true)} />
          </div>

          <PhotosField form={form} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BasicInfoFields form={form} />
            <div className="space-y-6">
              <StatusField form={form} />
              <IdentificationFields form={form} />
            </div>
            <SpecificationsFields form={form} />
            <PricingFields form={form} />
          </div>

          <NotesField form={form} />

          {/* Show investor access field only to administrators */}
          {isAdmin && (
            <div className="border p-4 rounded-md bg-veloz-black/30">
              <h3 className="text-base font-medium mb-3">Acesso para Investidores</h3>
              <InvestorAccessField form={form} vehicleId={vehicleId} />
            </div>
          )}

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
