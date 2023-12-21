import { type Metadata } from 'next';

import { Filters } from '~/components/filters';
import { MadeByDS } from '~/components/made-by-ds';
import { StatusCodes } from '~/components/status-codes';
import { STATUS_CODES } from '~/lib/status-codes';

export const metadata: Metadata = {
  authors: [{ name: 'Delicious Simplicity', url: 'https://delicious-simplicity.com' }],
  creator: 'Delicious Simplicity',
  description: 'Your one stop shop for HTTP status code references',
  keywords: ['http', 'status', 'codes', 'reference'],
  publisher: 'Delicious Simplicity',
  robots: 'index, follow',
  title: 'HTTP Status Codes | statcodes.dev',
};

const parseSearchParams = (params: SearchParams): ParsedSearchParams => {
  const { codeRange, search, extras } = params;

  return {
    codeRange: codeRange ? codeRange.split(',').map((code) => parseInt(code, 10)) : undefined,
    search,
    extras: extras
      ? extras.split(',').reduce(
          (acc, extra) => {
            if (extra === 'deprecated') acc.deprecated = true;
            if (extra === 'outsideSpec') acc.outsideSpec = true;

            return acc;
          },
          {} as Record<'deprecated' | 'outsideSpec', boolean>,
        )
      : undefined,
  };
};

export type ActiveFilters = ReturnType<typeof getActiveFilters>;
const getActiveFilters = (statusCodes: typeof STATUS_CODES, params: ParsedSearchParams) => {
  const availableCodeRanges = statusCodes.reduce((acc, { code }) => {
    const codeRange = Math.floor(code / 100);
    if (!acc.includes(codeRange)) acc.push(codeRange);
    return acc;
  }, [] as number[]);
  const availableExtras = statusCodes.reduce(
    (acc, { deprecated, outsideSpec }) => {
      if (deprecated && !acc.includes('deprecated')) acc.push('deprecated');
      if (outsideSpec && !acc.includes('outsideSpec')) acc.push('outsideSpec');
      return acc;
    },
    [] as ('deprecated' | 'outsideSpec')[],
  );

  const activeCodeRanges = availableCodeRanges.reduce(
    (acc, codeRange) => {
      if (params.codeRange?.includes(codeRange)) {
        acc[codeRange] = true;
        return acc;
      }
      acc[codeRange] = false;
      return acc;
    },
    {} as Record<number, boolean>,
  );
  const activeExtras = availableExtras.reduce(
    (acc, extra) => {
      if (params.extras?.[extra]) {
        acc[extra] = true;
        return acc;
      }
      acc[extra] = false;
      return acc;
    },
    {} as Record<'deprecated' | 'outsideSpec', boolean>,
  );

  return { activeCodeRanges, activeExtras };
};

type SearchParams = { codeRange?: string; search?: string; extras?: string };
export type ParsedSearchParams = {
  codeRange?: number[];
  search?: string;
  extras?: Record<'deprecated' | 'outsideSpec', boolean>;
};

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  const parsedSearchParams = parseSearchParams(searchParams);
  const activeFilters = getActiveFilters(STATUS_CODES, parsedSearchParams);

  return (
    <div className='min-h-screen p-4 sm:p-16 lg:p-24'>
      <header className='grid gap-4 pb-8 sm:grid-cols-2 sm:pb-12'>
        <div>
          <h1 className='mb-2 font-mono text-2xl font-bold sm:text-4xl'>HTTP Status Codes</h1>
          <MadeByDS />
        </div>

        {/* <Search /> */}
      </header>

      <main>
        <Filters filters={activeFilters} />

        <StatusCodes pageParams={parsedSearchParams} />
      </main>
    </div>
  );
}
