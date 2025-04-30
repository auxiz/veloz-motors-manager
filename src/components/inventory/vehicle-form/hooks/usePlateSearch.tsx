
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { VehicleFormData } from "../VehicleFormSchema";

export const usePlateSearch = (form: UseFormReturn<VehicleFormData>) => {
  const [plateDialogOpen, setPlateDialogOpen] = useState(false);
  
  const handleVehicleDataSelected = (data: Partial<VehicleFormData>) => {
    // Update form with data from API
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        form.setValue(key as keyof VehicleFormData, value);
      }
    });
  };

  return {
    plateDialogOpen,
    setPlateDialogOpen,
    handleVehicleDataSelected
  };
};
