import React, { PropsWithChildren } from 'react';
import styles from './list.module.scss';

type ListProps = PropsWithChildren<{

}>;

const List: React.FunctionComponent<ListProps> = ({
  children,
}) => {
  return (
    <div className={styles.root}>
      {children}
    </div>
  );
};

export default List;
