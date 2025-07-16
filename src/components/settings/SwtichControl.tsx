'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface SwitchControlProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function SwitchControl({
  label,
  checked,
  onCheckedChange,
}: SwitchControlProps) {
  return (
    <>
      <Label htmlFor={label} className="text-sm font-medium">
        {label}
      </Label>
      <Switch
        id={label}
        checked={checked}
        onCheckedChange={onCheckedChange}
        style={{
          backgroundColor: checked ? '#60A5FA' : '#D1D5DB',
        }}
        data-no-drag
      />
    </>
  );
}
