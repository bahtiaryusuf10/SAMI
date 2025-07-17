import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeTitleCase(val: unknown) {
  if (val === null || val === undefined) return null;

  const stringVal = String(val).trim();

  if (stringVal === '') return null;
  
  const cleaned = stringVal.toLowerCase();
  
  return cleaned
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}