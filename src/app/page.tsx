import { type Metadata } from 'next';

import { Filters } from '~/components/filters';
import { MadeByDS } from '~/components/made-by-ds';
import { Search } from '~/components/search';
import { StatusCodes } from '~/components/status-codes';

export const metadata: Metadata = {
  authors: [{ name: 'Delicious Simplicity', url: 'https://delicious-simplicity.com' }],
  creator: 'Delicious Simplicity',
  description: 'Your one stop shop for HTTP status code references',
  keywords: ['http', 'status', 'codes', 'reference'],
  publisher: 'Delicious Simplicity',
  robots: 'index, follow',
  title: 'HTTP Status Codes | statcodes.dev',
};

export default function Page() {
  return (
    <div className='min-h-screen p-4 sm:p-16 lg:p-24'>
      <header className='grid gap-4 pb-8 sm:grid-cols-2 sm:pb-12'>
        <div>
          <h1 className='mb-2 font-mono text-2xl font-bold sm:text-4xl'>HTTP Status Codes</h1>
          <MadeByDS />
        </div>

        <Search />
      </header>

      <main>
        <Filters />

        <StatusCodes />
      </main>
    </div>
  );
}
