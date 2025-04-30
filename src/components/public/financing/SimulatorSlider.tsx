
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-white font-medium block">{label}</label>
        <span className="text-white font-bold text-lg">
          {unit === 'currency' ? formatCurrency(value) : `${value}${unit}`}
        </span>
      </div>
      <Slider 
        value={[value]} 
        min={min} 
        max={max} 
        step={step} 
        onValueChange={(val) => onChange(val[0])}
        className={`w-full ${isMobile ? 'h-8' : ''}`}
        // Increase touch area for mobile
        style={isMobile ? { 
          touchAction: 'none',
          height: '24px'
        } : undefined}
      />
      {isMobile && (
        <div className="flex justify-between text-xs text-gray-400">
          <span>{unit === 'currency' ? formatCurrency(min) : min + unit}</span>
          <span>{unit === 'currency' ? formatCurrency(max) : max + unit}</span>
        </div>
      )}
    </div>
  );
};
