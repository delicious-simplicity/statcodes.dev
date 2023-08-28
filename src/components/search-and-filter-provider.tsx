'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { STATUS_CODES } from '~/lib/status-codes';

const SearchAndFilterContext = React.createContext<{
  codeRange: number[];
  extras: ('deprecated' | 'outsideSpec')[];
  filteredStatusCodeRanges: Record<number, typeof STATUS_CODES>;
  search: string;
  setCodeRange: React.Dispatch<React.SetStateAction<number[]>>;
  setExtras: React.Dispatch<React.SetStateAction<('deprecated' | 'outsideSpec')[]>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  statusCodeRanges: Record<number, typeof STATUS_CODES>;
}>(null!);

export const useSearchAndFilter = () => React.useContext(SearchAndFilterContext);

export const SearchAndFilterProvider = ({ children }: { children: React.ReactNode }) => {
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
  }, [codeRange, search, statusCodeRanges]);

  // update url params
  React.useEffect(() => {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams();

    if (search) urlParams.set('search', search);
    if (!search && codeRange.length) urlParams.set('codeRange', codeRange.join(','));
    if (!search && extras.length) urlParams.set('extras', extras.join(','));

    url.search = urlParams.toString();

    router.replace(url.toString());
  }, [codeRange, extras, router, search]);

  // set initial state from url params
  React.useEffect(() => {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);

    const searchParam = urlParams.get('search');
    const codeRangeParam = urlParams.get('codeRange');
    const extrasParam = urlParams.get('extras');

    if (searchParam) setSearch(searchParam);
    if (codeRangeParam) setCodeRange(codeRangeParam.split(',').map((r) => Number(r)));
    if (extrasParam) setExtras(extrasParam.split(',') as typeof extras);
  }, []);

  return (
    <SearchAndFilterContext.Provider
      value={{
        codeRange,
        extras,
        filteredStatusCodeRanges,
        search,
        setCodeRange,
        setExtras,
        setSearch,
        statusCodeRanges,
      }}
    >
      {children}
    </SearchAndFilterContext.Provider>
  );
};
