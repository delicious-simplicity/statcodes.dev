'use client';

import { cn } from '~/lib/utils';
import { useSearchAndFilter } from './search-and-filter-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const rangeTitleMap: Record<number, string> = {
  1: 'Informational',
  2: 'Success',
  3: 'Redirection',
  4: 'Client Error',
  5: 'Server Error',
};

export const StatusCodes = () => {
  const { filteredStatusCodeRanges, extras } = useSearchAndFilter();

  return (
    <>
      {Object.entries(filteredStatusCodeRanges).map(([range, statuses]) => {
        return (
          <section key={range} className='pb-12'>
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
              {rangeTitleMap[Number(range)] ? (
                <span className='text-white'>{` - ${rangeTitleMap[Number(range)]}`}</span>
              ) : (
                ''
              )}
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
                .map(({ code, description, name, deprecated, outsideSpec }) => {
                  return (
                    <Card
                      className={cn(
                        'group min-h-[142px] hover:cursor-pointer',
                        outsideSpec && 'border-yellow-500 dark:border-yellow-500',
                        deprecated && 'border-red-500 dark:border-red-500',
                      )}
                      key={code}
                      // onClick={() => router.push(`/${code}`)}
                    >
                      <CardHeader>
                        <CardTitle title={name} className='truncate text-xl group-hover:underline'>
                          <span className='font-mono'>{code}</span> - {name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{description}</CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
            </section>
          </section>
        );
      })}
    </>
  );
};
