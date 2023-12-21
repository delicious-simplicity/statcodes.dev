'use client';

import { useRouter } from 'next/navigation';

import { ActiveFilters } from '~/app/page';
import { splitCamelAndCapitalize, splitCamelAndLowercase } from '~/lib/utils';

import { Toggle } from './ui/toggle';

export const Filters = ({ filters }: { filters: ActiveFilters }) => {
  const router = useRouter();

  return (
    <section className='flex flex-col pb-8 font-mono sm:flex-row sm:justify-between sm:pb-12'>
      {/* status code filters */}
      <div className='grid grid-cols-5 gap-2 sm:grid-cols-7'>
        {Object.entries(filters.activeCodeRanges).map(([range, active]) => {
          return (
            <Toggle
              variant={`outline-${range}` as 'outline-1'}
              aria-label={`Toggle ${range}00 status code range`}
              key={range}
              pressed={active}
              onClick={() => {
                const url = new URL(window.location.origin);
                const params = new URLSearchParams(url.search);

                let activeCodeRanges = [];
                if (active) {
                  for (const activeCodeRange in filters.activeCodeRanges) {
                    if (filters.activeCodeRanges[activeCodeRange] && activeCodeRange !== range)
                      activeCodeRanges.push(activeCodeRange);
                  }
                } else {
                  for (const activeCodeRange in filters.activeCodeRanges) {
                    if (activeCodeRange === range || filters.activeCodeRanges[activeCodeRange])
                      activeCodeRanges.push(activeCodeRange);
                  }
                }
                activeCodeRanges.length > 0 && params.set('codeRange', activeCodeRanges.join(','));

                let activeExtras = [];
                for (const extra in filters.activeExtras) {
                  if (filters.activeExtras[extra as 'deprecated']) activeExtras.push(extra);
                }
                activeExtras.length > 0 && params.set('extras', activeExtras.join(','));

                url.search = params.toString();
                const urlString = url.toString();
                router.replace(urlString);
              }}
            >
              {range}xx
            </Toggle>
          );
        })}
      </div>

      {/* extra filters */}
      <div className='pt-2 sm:pt-0'>
        {Object.entries(filters.activeExtras).map(([extraFilter, active]) => {
          return (
            <Toggle
              className='mr-2'
              variant='outline'
              aria-label={`Toggle ${splitCamelAndLowercase(extraFilter as 'deprecated')} status codes`}
              key={extraFilter}
              pressed={active}
              onClick={() => {
                const url = new URL(window.location.origin);
                const params = new URLSearchParams(url.search);

                let activeCodeRanges = [];
                for (const activeCodeRange in filters.activeCodeRanges) {
                  if (filters.activeCodeRanges[activeCodeRange]) activeCodeRanges.push(activeCodeRange);
                }
                activeCodeRanges.length > 0 && params.set('codeRange', activeCodeRanges.join(','));

                let activeExtras = [];
                if (active) {
                  for (const extra in filters.activeExtras) {
                    if (filters.activeExtras[extra as 'deprecated'] && extra !== extraFilter) activeExtras.push(extra);
                  }
                } else {
                  for (const extra in filters.activeExtras) {
                    if (extra === extraFilter || filters.activeExtras[extra as 'deprecated']) activeExtras.push(extra);
                  }
                }
                activeExtras.length > 0 && params.set('extras', activeExtras.join(','));

                url.search = params.toString();
                const urlString = url.toString();
                router.replace(urlString);
              }}
            >
              {/* split on capital letters */}
              {splitCamelAndCapitalize(extraFilter)}
            </Toggle>
          );
        })}
      </div>
    </section>
  );
};
