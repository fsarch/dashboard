import React, { PropsWithChildren, ReactElement } from 'react';
import styles from './list-item.module.scss';

type ListItemProps = PropsWithChildren<{
  right?: ReactElement | null;
}>;

const ListItem: React.FunctionComponent<ListItemProps> = ({
  children,
  right,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.main}>
        {children}
      </div>
      {right ? (
        <div className={styles.right}>
          {right}
        </div>
      ) : null}
    </div>
  );
};

export default ListItem;
