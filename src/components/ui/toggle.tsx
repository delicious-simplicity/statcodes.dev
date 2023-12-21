'use client';

import * as React from 'react';

import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/lib/utils';

const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-slate-100 hover:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-slate-100 data-[state=on]:text-slate-900 dark:ring-offset-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-400 dark:focus-visible:ring-slate-300 dark:data-[state=on]:bg-slate-800 dark:data-[state=on]:text-slate-50',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline:
          'border border-slate-200 bg-transparent hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-50',
        'outline-1':
          'border border-blue-500 bg-transparent hover:bg-blue-50 hover:text-blue-900 data-[state=on]:bg-blue-50 data-[state=on]:text-blue-900 dark:border-blue-500 dark:hover:bg-blue-900 dark:hover:text-blue-50 dark:data-[state=on]:bg-blue-900 dark:data-[state=on]:text-blue-50',
        'outline-2':
          'border border-green-500 bg-transparent hover:bg-green-50 hover:text-green-900 dark:border-green-500 dark:hover:bg-green-900 dark:hover:text-green-50 dark:data-[state=on]:bg-green-900 dark:data-[state=on]:text-green-50',
        'outline-3':
          'border border-yellow-500 bg-transparent hover:bg-yellow-50 hover:text-yellow-900 dark:border-yellow-500 dark:hover:bg-yellow-900 dark:hover:text-yellow-50 dark:data-[state=on]:bg-yellow-900 dark:data-[state=on]:text-yellow-50',
        'outline-4':
          'border border-orange-500 bg-transparent hover:bg-orange-50 hover:text-orange-900 dark:border-orange-500 dark:hover:bg-orange-900 dark:hover:text-orange-50 dark:data-[state=on]:bg-orange-900 dark:data-[state=on]:text-orange-50',
        'outline-5':
          'border border-red-500 bg-transparent hover:bg-red-50 hover:text-red-900 dark:border-red-500 dark:hover:bg-red-900 dark:hover:text-red-50 dark:data-[state=on]:bg-red-900 dark:data-[state=on]:text-red-50',
        'outline-6':
          'border border-pink-500 bg-transparent hover:bg-pink-50 hover:text-pink-900 dark:border-pink-500 dark:hover:bg-pink-900 dark:hover:text-pink-50 dark:data-[state=on]:bg-pink-900 dark:data-[state=on]:text-pink-50',
        'outline-9':
          'border border-gray-500 bg-transparent hover:bg-gray-50 hover:text-gray-900 dark:border-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-50 dark:data-[state=on]:bg-gray-900 dark:data-[state=on]:text-gray-50',
      },
      size: {
        default: 'h-10 px-3',
        sm: 'h-9 px-2.5',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ variant, size, className }))} {...props} />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle };
