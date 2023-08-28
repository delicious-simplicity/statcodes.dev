'use client';

import { splitCamelAndCapitalize, splitCamelAndLowercase } from '~/lib/utils';
import { useSearchAndFilter } from './search-and-filter-provider';
import { Toggle } from './ui/toggle';

export const Filters = () => {
  const { statusCodeRanges, extras, codeRange, setExtras, setCodeRange } = useSearchAndFilter();

  return (
    <section className='flex flex-col pb-8 font-mono sm:flex-row sm:justify-between sm:pb-12'>
      {/* status code filters */}
      <div className='grid grid-cols-5 gap-2 sm:grid-cols-7'>
        {Object.entries(statusCodeRanges)
          .filter(([, status]) => {
            const filteredStatuses = status.filter(({ deprecated, outsideSpec }) => {
              if (typeof deprecated === 'undefined' && typeof outsideSpec === 'undefined') return true;
              if (typeof deprecated === 'undefined' && extras.includes('outsideSpec') && outsideSpec) return true;
              if (typeof outsideSpec === 'undefined' && extras.includes('deprecated') && deprecated) return true;
              if (extras.includes('deprecated') && deprecated) return true;
              if (extras.includes('outsideSpec') && outsideSpec) return true;
              return false;
            });
            if (filteredStatuses.length) return true;
            return false;
          })
          .map(([range]) => {
            return (
              <Toggle
                variant={`outline-${range}` as 'outline-1'}
                aria-label={`Toggle ${range}00 status code range`}
                key={range}
                pressed={codeRange.includes(Number(range))}
                onClick={() =>
                  setCodeRange((prev) => {
                    if (prev.includes(Number(range))) return prev.filter((r) => r !== Number(range));
                    return [...prev, Number(range)];
                  })
                }
              >
                {range}xx
              </Toggle>
            );
          })}
      </div>

      {/* extra filters */}
      <div className='pt-2 sm:pt-0'>
        {(['deprecated', 'outsideSpec'] as ['deprecated', 'outsideSpec']).map((extraFilter) => {
          return (
            <Toggle
              className='mr-2'
              variant='outline'
              aria-label={`Toggle ${splitCamelAndLowercase(extraFilter)} status codes`}
              key={extraFilter}
              pressed={extras.includes(extraFilter)}
              onClick={() =>
                setExtras((prev) => {
                  if (prev.includes(extraFilter)) return prev.filter((r) => r !== extraFilter);
                  return [...prev, extraFilter];
                })
              }
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
