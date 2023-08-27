import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
export const splitCamelAndCapitalize = (str: string) =>
  str.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
