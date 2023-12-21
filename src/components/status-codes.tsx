import { type ParsedSearchParams } from '~/app/page';
import { STATUS_CODES } from '~/lib/status-codes';
import { cn } from '~/lib/utils';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const rangeTitleMap: Record<number, string> = {
  1: 'Informational',
  2: 'Success',
  3: 'Redirection',
  4: 'Client Error',
  5: 'Server Error',
};

const getHttpStatusCodes = ({ codeRange, search, extras }: ParsedSearchParams) => {
  let statusCodes = STATUS_CODES;

  if (search) {
    statusCodes = statusCodes.filter(({ code, name }) => {
      const codeMatch = code.toString().includes(search);
      const nameMatch = name.toLowerCase().includes(search.toLowerCase());

      return codeMatch || nameMatch;
    });
  }

  if (codeRange) {
    statusCodes = statusCodes.filter(({ code, deprecated, outsideSpec }) => {
      const codeMatch = codeRange.includes(Math.floor(code / 100));
      if (deprecated && !extras?.deprecated) return false;
      if (outsideSpec && !extras?.outsideSpec) return false;

      return codeMatch;
    });
  }

  if (!codeRange && !search) {
    statusCodes = statusCodes.filter(({ code, deprecated, outsideSpec }) => {
      if (code >= 200 && code <= 600 && !deprecated && !outsideSpec) return true;
      return false;
    });
  }

  const statusCodesMap = statusCodes.reduce(
    (acc, statusCode) => {
      const codeRange = Math.floor(statusCode.code / 100);

      if (!acc[codeRange] || !Array.isArray(acc[codeRange])) {
        acc[codeRange] = [statusCode];
        return acc;
      }
      if (acc[codeRange] && Array.isArray(acc[codeRange])) {
        (acc[codeRange] as (typeof statusCodes)[number][]).push(statusCode);
      }
      return acc;
    },
    {} as Record<number, (typeof statusCodes)[number][]>,
  );

  return statusCodesMap;
};

export const StatusCodes = ({ pageParams }: { pageParams: ParsedSearchParams }) => {
  const statusCodes = getHttpStatusCodes(pageParams);

  return (
    <>
      {Object.entries(statusCodes).map(([range, statuses]) => {
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
              {statuses.map(({ code, description, name, deprecated, outsideSpec }) => {
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
