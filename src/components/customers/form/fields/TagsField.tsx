
import React from 'react';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { CheckboxReactHookFormMultiple } from '@/components/ui/checkbox-multiple';
import { CustomerFormValues } from '../CustomerFormSchema';
import { CUSTOMER_SEGMENTS } from '@/types/customer';

interface TagsFieldProps {
  form: UseFormReturn<CustomerFormValues>;
}

export const TagsField: React.FC<TagsFieldProps> = ({ form }) => {
  // Group segments by type for the UI
  const behaviorSegments = CUSTOMER_SEGMENTS.filter(s => s.type === 'behavior');
  const preferenceSegments = CUSTOMER_SEGMENTS.filter(s => s.type === 'preference');

  return (
    <FormField
      control={form.control}
      name="tags"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Segmentação do Cliente</FormLabel>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Comportamento do Cliente</h4>
              <CheckboxReactHookFormMultiple
                items={behaviorSegments.map(s => ({ id: s.id, label: s.label }))}
                value={field.value}
                onChange={field.onChange}
              />
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Preferências do Cliente</h4>
              <CheckboxReactHookFormMultiple
                items={preferenceSegments.map(s => ({ id: s.id, label: s.label }))}
                value={field.value}
                onChange={field.onChange}
              />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};
