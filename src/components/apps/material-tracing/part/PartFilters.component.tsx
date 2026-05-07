'use client';

import React, { useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Form, Formik, useFormikContext } from 'formik';
import SearchInput from '@/components/universals/forms/SearchInput.component';
import SearchableSelect from '@/components/universals/forms/searchable-select/SearchableSelect.component';

type PartFilterType = {
  id: string;
  name: string;
};

type PartFiltersProps = {
  partTypes: Array<PartFilterType>;
};

type TPartTypeFilterFormValues = {
  partTypeId: string;
};

type PartTypeUrlSyncProps = {
  pathname: string;
  searchParamsValue: string;
  selectedPartTypeId: string;
};

const PartTypeUrlSync: React.FunctionComponent<PartTypeUrlSyncProps> = ({
  pathname,
  searchParamsValue,
  selectedPartTypeId,
}) => {
  const router = useRouter();
  const { values } = useFormikContext<TPartTypeFilterFormValues>();

  useEffect(() => {
    if (values.partTypeId === selectedPartTypeId) {
      return;
    }

    const params = new URLSearchParams(searchParamsValue);
    if (values.partTypeId) {
      params.set('partTypeId', values.partTypeId);
    } else {
      params.delete('partTypeId');
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(newUrl);
    router.refresh();
  }, [pathname, router, searchParamsValue, selectedPartTypeId, values.partTypeId]);

  return null;
};

const PartFilters: React.FunctionComponent<PartFiltersProps> = ({ partTypes }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedPartTypeId = searchParams.get('partTypeId') || '';
  const partTypeOptions = useMemo(
    () => [{ value: '', label: 'All part types' }, ...partTypes.map((partType) => ({
      id: partType.id,
      value: partType.id,
      label: partType.name,
    }))],
    [partTypes],
  );

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <SearchInput />
      <Formik<TPartTypeFilterFormValues>
        initialValues={{ partTypeId: selectedPartTypeId }}
        enableReinitialize
        onSubmit={() => undefined}
      >
        <Form>
          <SearchableSelect
            name="partTypeId"
            values={partTypeOptions}
          />
          <PartTypeUrlSync
            pathname={pathname}
            searchParamsValue={searchParams.toString()}
            selectedPartTypeId={selectedPartTypeId}
          />
        </Form>
      </Formik>
    </div>
  );
};

export default PartFilters;


