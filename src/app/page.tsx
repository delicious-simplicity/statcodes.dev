'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { MadeByDS } from '~/components/made-by-ds';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Toggle } from '~/components/ui/toggle';
import { STATUS_CODES } from '~/lib/status-codes';
import { cn, splitCamelAndCapitalize } from '~/lib/utils';

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [extras, setExtras] = React.useState<('deprecated' | 'outsideSpec')[]>([]);
  const [codeRange, setCodeRange] = React.useState<number[]>([2, 3, 4, 5]);

  const statusCodeRanges = React.useMemo(
    () =>
      STATUS_CODES.reduce(
        (acc, status) => {
          const range = Math.floor(status.code / 100);
          if (!acc[range]) acc[range] = [];
          acc[range]?.push(status);
          return acc;
        },
        {} as Record<number, typeof STATUS_CODES>,
      ),
    [],
  );

  const filteredStatusCodeRanges = React.useMemo(() => {
    if (search) {
      return Object.entries(statusCodeRanges).reduce(
        (acc, [range, statuses]) => {
          const filteredStatuses = statuses.filter((status) => {
            return status.code.toString().includes(search) || status.name.toLowerCase().includes(search.toLowerCase());
          });
          if (filteredStatuses.length) acc[Number(range)] = filteredStatuses;
          return acc;
        },
        {} as Record<number, typeof STATUS_CODES>,
      );
    }

    return Object.entries(statusCodeRanges).reduce(
      (acc, [range, statuses]) => {
        if (codeRange.includes(Number(range))) {
          acc[Number(range)] = statuses;
        }
        return acc;
      },
      {} as Record<number, typeof STATUS_CODES>,
    );
  }, [codeRange, search]);

  React.useEffect(() => {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams();

    if (search) urlParams.set('search', search);
    if (!search && codeRange.length) urlParams.set('codeRange', codeRange.join(','));
    if (!search && extras.length) urlParams.set('extras', extras.join(','));

    url.search = urlParams.toString();

    router.replace(url.toString());
  }, [search, codeRange, extras]);

  return (
    <main className='min-h-screen p-4 sm:p-16 lg:p-24'>
      <header className='grid gap-4 pb-8 sm:grid-cols-2 sm:pb-12'>
        <div>
          <h1 className='mb-2 font-mono text-2xl font-bold sm:text-4xl'>HTTP Status Codes</h1>
          <MadeByDS />
        </div>
        <div className='flex w-full justify-end'>
          <Label className='sr-only' htmlFor='search'>
            Search
          </Label>
          <Input
            autoFocus
            className='mr-4 max-w-sm'
            id='search'
            onChange={(e) => setSearch(e.target.value)}
            placeholder='2xx  ||  "Internal Server..."'
          />
        </div>
      </header>

      <aside className='flex flex-col pb-8 font-mono sm:flex-row sm:justify-between sm:pb-12'>
        <div className='grid grid-cols-5 gap-2 sm:grid-cols-7'>
          {/* status code filters */}
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
        <div className='pt-2 sm:pt-0'>
          {(['deprecated', 'outsideSpec'] as ['deprecated', 'outsideSpec']).map((extraFilter) => {
            return (
              <Toggle
                className='mr-2'
                variant='outline'
                aria-label={`Toggle ${extraFilter} status code range`}
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
      </aside>

      {Object.entries(filteredStatusCodeRanges).map(([range, statuses]) => {
        return (
          <article key={range} className='pb-12'>
            <h2
              className={cn(
                'pb-6 font-mono text-2xl',
                range === '1' && 'text-blue-500',
                range === '2' && 'text-green-500',
                range === '3' && 'text-yellow-500',
                range === '4' && 'text-orange-500',
                range === '5' && 'text-red-500',
                range === '6' && 'text-pink-500',
                range === '9' && 'text-gray-500',
              )}
            >
              {range}xx
            </h2>
            <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {statuses
                .filter(({ deprecated, outsideSpec }) => {
                  if (typeof deprecated === 'undefined' && typeof outsideSpec === 'undefined') return true;
                  if (typeof deprecated === 'undefined' && extras.includes('outsideSpec') && outsideSpec) return true;
                  if (typeof outsideSpec === 'undefined' && extras.includes('deprecated') && deprecated) return true;
                  if (extras.includes('deprecated') && deprecated) return true;
                  if (extras.includes('outsideSpec') && outsideSpec) return true;
                  return false;
                })
                .map((status) => {
                  return (
                    <Card
                      className={cn(
                        'group min-h-[142px] hover:cursor-pointer',
                        status.outsideSpec && 'border-yellow-500 dark:border-yellow-500',
                        status.deprecated && 'border-red-500 dark:border-red-500',
                      )}
                      key={status.code}
                      // onClick={() => router.push(`/${status.code}`)}
                    >
                      <CardHeader>
                        <CardTitle title={status.name} className='truncate text-xl group-hover:underline'>
                          <span className='font-mono'>{status.code}</span> - {status.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{status.description}</CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
            </section>
          </article>
        );
      })}
    </main>
  );
}
