import React, { PropsWithChildren, ReactElement } from 'react';
import styles from './list-item.module.scss';

type ListItemProps = PropsWithChildren<{
  left?: ReactElement | null;
  right?: ReactElement | null;
}>;

const ListItem: React.FunctionComponent<ListItemProps> = ({
  children,
  right,
  left,
}) => {
  return (
    <div className={styles.root}>
      {left ? (
        <div className={styles.left}>
          {left}
        </div>
      ) : null}
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
