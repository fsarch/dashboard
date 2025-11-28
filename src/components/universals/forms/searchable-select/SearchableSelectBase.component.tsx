'use client';

import React, { ChangeEvent, ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { useField } from "formik";
import SearchableSelectItem, {
  SearchableSelectItemValueType
} from "@/components/universals/forms/searchable-select/SearchableSelectItem.component";
import styles from './SearchableSelect.module.scss';
import clsx from "clsx";

type SearchableSelectProps = {
  id?: string;
  name: string;
  values: Array<{ id?: string; value: string; label: string; }>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

const SearchableSelect: React.FunctionComponent<SearchableSelectProps> = ({
  id,
  name,
  values,
  onChange,
}) => {
  const [inputProps, metaProps, helpers] = useField(name);

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState('');

  const handleValueChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  }, [setSearchValue]);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    const callback = () => {
      setIsFocused(false);
    };

    window.addEventListener('click', callback);

    return () => {
      window.removeEventListener('click', callback);
    };
  }, [setIsFocused, isFocused]);

  const handleItemClick = useCallback(async (value: SearchableSelectItemValueType) => {
    await helpers.setValue(value.id ?? value.value);
    await helpers.setTouched(true);
    setIsFocused(false);
  }, [setIsFocused]);

  const selectedItem = useMemo(
    () => values.find((val) => val.id ? inputProps.value === val.id : inputProps.value === val.value),
    [inputProps.value],
  );

  const handleFocus = useCallback(() => setIsFocused(true), [setIsFocused]);

  const filteredValues = useMemo(
    () => {
      if (!searchValue) {
        return values;
      }

      const normalizedSearchValue = searchValue.toLowerCase();

      return values.filter((value) => value.label.toLowerCase().includes(normalizedSearchValue))
    },
    [values, searchValue],
  );

  return (
    <>
      <div
        className={styles.root}
        tabIndex={0}
        onFocus={handleFocus}
        onClick={isFocused ? (event) => event.stopPropagation() : undefined}
      >
        <div className={styles.input}>
          {selectedItem?.label}
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={handleValueChange}
          className={clsx(styles.searchInput, isFocused && styles.searchInputVisible)}
        />
        <div
          className={clsx(styles.datatable, isFocused && styles.datatableVisible)}
        >
          {filteredValues.map((value) => (
            <SearchableSelectItem
              key={value.id ?? value.value}
              value={value}
              onClick={handleItemClick}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchableSelect;
