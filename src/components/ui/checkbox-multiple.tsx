
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Item = {
  id: string;
  label: string;
};

interface CheckboxMultipleProps {
  items: Item[];
  selectedItems?: string[];
  onChange?: (selectedItems: string[]) => void;
}

export const CheckboxMultiple: React.FC<CheckboxMultipleProps> = ({ 
  items, 
  selectedItems = [], 
  onChange 
}) => {
  const handleCheckboxChange = (itemId: string, checked: boolean) => {
    if (!onChange) return;

    if (checked) {
      onChange([...selectedItems, itemId]);
    } else {
      onChange(selectedItems.filter(id => id !== itemId));
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center space-x-2">
          <Checkbox
            id={`checkbox-${item.id}`}
            checked={selectedItems.includes(item.id)}
            onCheckedChange={(checked) => 
              handleCheckboxChange(item.id, checked === true)
            }
          />
          <Label htmlFor={`checkbox-${item.id}`} className="text-sm">
            {item.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

interface CheckboxReactHookFormMultipleProps {
  items: Item[];
  value?: string[];
  onChange?: (value: string[]) => void;
}

export const CheckboxReactHookFormMultiple: React.FC<CheckboxReactHookFormMultipleProps> = ({
  items,
  value = [],
  onChange
}) => {
  return (
    <CheckboxMultiple
      items={items}
      selectedItems={value}
      onChange={onChange}
    />
  );
};
