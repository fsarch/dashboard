import React, { useCallback } from 'react';

import styles from './SearchableSelectItem.module.scss';

export type SearchableSelectItemValueType = {
  id?: string;
  value: string;
  label: string;
};

type SearchableSelectItemProps = {
  value: SearchableSelectItemValueType;
  onClick: (value: SearchableSelectItemValueType) => void;
};

const SearchableSelectItem: React.FunctionComponent<SearchableSelectItemProps> = ({
  value,
  onClick,
}) => {
  const handleClick = useCallback(() => {
    onClick(value);
  }, [onClick, value]);

  return (
    <div
      onClick={handleClick}
      className={styles.root}
      tabIndex={0}
    >
      {value.label}
    </div>
  );
};

export default SearchableSelectItem;
