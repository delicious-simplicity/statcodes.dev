'use client';

import { useSearchAndFilter } from './search-and-filter-provider';
import { Input } from './ui/input';
import { Label } from './ui/label';

export const Search = () => {
  const { search, setSearch } = useSearchAndFilter();

  return (
    <div className='flex w-full justify-end'>
      <Label className='sr-only' htmlFor='search'>
        Search
      </Label>
      <Input
        autoFocus
        className='mr-4 max-w-sm'
        defaultValue={search}
        id='search'
        onChange={(e) => setSearch(e.target.value)}
        placeholder='2xx  ||  "Internal Server..."'
      />
    </div>
  );
};
