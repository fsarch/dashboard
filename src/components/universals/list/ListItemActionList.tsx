import React, { PropsWithChildren } from 'react';

import styles from './list-item-action-list.module.scss';

const ListItemActionList: React.FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  return (
    <div className={styles.root}>
      {children}
    </div>
  );
};

export default ListItemActionList;
