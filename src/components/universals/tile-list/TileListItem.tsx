import React from 'react';

import styles from './tile-list-item.module.scss';
import Icon from "@/components/universals/icon/Icon.component";
import { TIcon } from "@/components/universals/icon/Icon.type";

type TileListItemProps = {
  name: string;
  backgroundImage?: string;
  icon?: TIcon;
};

const TileListItem: React.FunctionComponent<TileListItemProps> = ({
  name,
  backgroundImage,
  icon,
}) => {
  return (
    <div
      className={styles.root}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
      }}
    >
      {icon ? (
        <div
          className={styles.icon}
        >
          <Icon
            icon={icon}
          />
        </div>
      ) : null}
      <div className={styles.name}>{name}</div>
    </div>
  );
};

export default TileListItem;
