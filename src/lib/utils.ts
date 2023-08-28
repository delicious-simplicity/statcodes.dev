import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const splitCamelAndCapitalize = (str: string) =>
  str.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
export const splitCamelAndLowercase = (str: string) => str.replace(/([A-Z])/g, ' $1').toLowerCase();
