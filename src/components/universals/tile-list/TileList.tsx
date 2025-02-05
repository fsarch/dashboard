import React, { PropsWithChildren } from 'react';

import styles from './tile-list.module.scss';

type TileListProps = PropsWithChildren<{

}>;

const TileList: React.FunctionComponent<TileListProps> = ({
  children,
}) => {
  return (
    <div className={styles.root}>
      {children}
    </div>
  );
};

export default TileList;
