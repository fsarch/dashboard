'use client';

import React, { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import selectStyles from '@/components/universals/forms/Select.module.scss';

const DEFAULT_SORT = 'desc:creationTime';

const SORT_OPTIONS = [
  { value: DEFAULT_SORT, label: 'Neueste zuerst' },
  { value: 'asc:creationTime', label: 'Älteste zuerst' },
  { value: 'desc:sendTime', label: 'Versandt (neueste zuerst)' },
  { value: 'asc:sendTime', label: 'Versandt (älteste zuerst)' },
  { value: 'asc:subject', label: 'Betreff (A-Z)' },
  { value: 'desc:subject', label: 'Betreff (Z-A)' },
];

const EmailSortSelect: React.FunctionComponent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || DEFAULT_SORT;

  const handleChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== DEFAULT_SORT) {
      params.set('sort', value);
    } else {
      params.delete('sort');
    }

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    router.refresh();
  }, [pathname, router, searchParams]);

  return (
    <select
      value={currentSort}
      onChange={handleChange}
      className={selectStyles.input}
      aria-label="Sortierung"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default EmailSortSelect;
