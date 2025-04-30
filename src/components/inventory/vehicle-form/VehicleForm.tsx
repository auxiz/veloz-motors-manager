
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

interface VehicleFormProps {
  onSubmit: (data: VehicleFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<VehicleFormData>;
}

export type { VehicleFormData } from "./VehicleFormSchema";

export function VehicleForm({ onSubmit, isLoading, initialData }: VehicleFormProps) {
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

  const { plateDialogOpen, setPlateDialogOpen, handleVehicleDataSelected } = usePlateSearch(form);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-end">
            <PlateSearchButton onClick={() => setPlateDialogOpen(true)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BasicInfoFields form={form} />
            <IdentificationFields form={form} />
            <SpecificationsFields form={form} />
            <PricingFields form={form} />
          </div>

          <NotesField form={form} />

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
