import React, { PropsWithChildren } from 'react';
import styles from './list-item.module.scss';

type ListItemProps = PropsWithChildren<{

}>;

const ListItem: React.FunctionComponent<ListItemProps> = ({
  children,
}) => {
  return (
    <div className={styles.root}>
      {children}
    </div>
  );
};

export default ListItem;
