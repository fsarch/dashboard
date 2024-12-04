import React, { MouseEventHandler } from 'react';

type DataTableMenuProps = {
  onApplyClick: MouseEventHandler<HTMLButtonElement>;
  onRevertClick: MouseEventHandler<HTMLButtonElement>;
};

const DataTableMenu: React.FunctionComponent<DataTableMenuProps> = ({
  onApplyClick,
  onRevertClick,
}) => {
  return (
    <div>
      <button onClick={onApplyClick}>
        Apply
      </button>
      <button onClick={onRevertClick}>
        Revert
      </button>
    </div>
  );
};

export default DataTableMenu;
