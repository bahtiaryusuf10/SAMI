'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface SliderControlProps {
  label: string;
  value: number;
  onValueChange: (value: number[]) => void;
  max: number;
  step: number;
}

export function SliderControl({
  label,
  value,
  onValueChange,
  max,
  step,
}: SliderControlProps) {
  return (
    <>
      <Label className="text-sm font-medium mb-1">{label}</Label>
      <Slider
        className="mt-2 mb-4 [&>[data-slider-track]]:bg-blue-200 [&>[data-slider-range]]:bg-blue-500 [&>[data-slider-thumb]]:bg-blue-600"
        value={[value]}
        onValueChange={onValueChange}
        max={max}
        step={step}
        data-no-drag
      />
    </>
  );
}
