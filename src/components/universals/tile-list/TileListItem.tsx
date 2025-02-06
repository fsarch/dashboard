import React from 'react';

import styles from './tile-list-item.module.scss';

type TileListItemProps = {
  name: string;
  backgroundImage?: string;
};

const TileListItem: React.FunctionComponent<TileListItemProps> = ({
  name,
  backgroundImage,
}) => {
  return (
    <div
      className={styles.root}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
      }}
    >
      <div className={styles.name}>{name}</div>
    </div>
  );
};

export default TileListItem;
