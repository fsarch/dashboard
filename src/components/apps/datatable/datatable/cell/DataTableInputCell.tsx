import React, { ChangeEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import styles from './DataTableInputCell.module.scss';
import clsx from "clsx";

type DataTableInputCellProps = {
  value: string;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

const DataTableInputCell: React.FunctionComponent<DataTableInputCellProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const handleDoubleClick = useCallback(() => {
    setEditMode(true);
  }, [setEditMode]);

  const ref = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (editMode && ref.current) {
      ref.current.focus();
    }
  }, [editMode]);

  return (
    <div
      className={styles.root}
    >
      <div
        className={clsx(styles.disabledOverlay, editMode && styles.hideDisabledOverlay)}
        onDoubleClick={handleDoubleClick}
      />
      <input
        ref={ref}
        onChange={onChange}
        className={styles.input}
        value={value}
        disabled={disabled ?? !editMode}
      />
    </div>
  );
};

export default DataTableInputCell;
