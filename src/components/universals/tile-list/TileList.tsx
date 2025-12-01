import React, { PropsWithChildren } from 'react';

import styles from './tile-list.module.scss';
import clsx from "clsx";

type TileListProps = PropsWithChildren<{
  orientation?: 'left' | 'center' | 'right';
}>;

const TileList: React.FunctionComponent<TileListProps> = ({
  children,
  orientation = 'center',
}) => {
  return (
    <div
      className={clsx(styles.root, {
        [styles.rootStart]: orientation === 'left',
        [styles.rootEnd]: orientation === 'right',
      })}
    >
      {children}
    </div>
  );
};

export default TileList;
