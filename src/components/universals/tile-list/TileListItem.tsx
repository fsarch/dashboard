import React from 'react';

import styles from './tile-list-item.module.scss';

type TileListItemProps = {
  name: string;
};

const TileListItem: React.FunctionComponent<TileListItemProps> = ({
  name,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.name}>{name}</div>
    </div>
  );
};

export default TileListItem;
