
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/lib/utils';

interface SimulatorSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}

export const SimulatorSlider: React.FC<SimulatorSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-white font-medium block">{label}</label>
      <div className="flex items-center space-x-4">
        <span className="text-white font-bold text-lg w-28">
          {unit === 'currency' ? formatCurrency(value) : `${value}${unit}`}
        </span>
        <Slider 
          value={[value]} 
          min={min} 
          max={max} 
          step={step} 
          onValueChange={(val) => onChange(val[0])}
          className="flex-1"
        />
      </div>
    </div>
  );
};
