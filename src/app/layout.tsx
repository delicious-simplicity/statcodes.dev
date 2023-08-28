import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ThemeProvider } from '~/components/theme-provider';
import './globals.css';
import { SearchAndFilterProvider } from '~/components/search-and-filter-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stat Codes',
  description: 'Your one stop shop for HTTP status code references',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ThemeProvider attribute='class' defaultTheme='dark'>
          <SearchAndFilterProvider>{children}</SearchAndFilterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
