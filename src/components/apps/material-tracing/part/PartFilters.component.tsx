'use client';

import React, { ChangeEvent, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SearchInput from '@/components/universals/forms/SearchInput.component';
import selectStyles from '@/components/universals/forms/Select.module.scss';

type PartFilterType = {
  id: string;
  name: string;
};

type PartFiltersProps = {
  partTypes: Array<PartFilterType>;
};

const PartFilters: React.FunctionComponent<PartFiltersProps> = ({ partTypes }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedPartTypeId = searchParams.get('partTypeId') || '';

  const handlePartTypeChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = event.target.value;

    if (value) {
      params.set('partTypeId', value);
    } else {
      params.delete('partTypeId');
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(newUrl);
    router.refresh();
  }, [pathname, router, searchParams]);

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <SearchInput />
      <select
        aria-label="Filter by part type"
        className={selectStyles.input}
        value={selectedPartTypeId}
        onChange={handlePartTypeChange}
      >
        <option value="">All part types</option>
        {partTypes.map((partType) => (
          <option key={partType.id} value={partType.id}>
            {partType.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PartFilters;


