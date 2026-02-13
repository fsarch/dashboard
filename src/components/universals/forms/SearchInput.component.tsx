'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import styles from './Input.module.scss';

type SearchInputProps = {
  placeholder?: string;
  debounceMs?: number;
};

const SearchInput: React.FunctionComponent<SearchInputProps> = ({
  placeholder = 'Suchen...',
  debounceMs = 300,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');

  const updateSearchParam = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl);
    router.refresh();
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateSearchParam(searchValue);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchValue, debounceMs, updateSearchParam]);

  return (
    <input
      className={styles.root}
      type="text"
      placeholder={placeholder}
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
    />
  );
};

export default SearchInput;
