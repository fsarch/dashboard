import clsx from 'clsx';
import type React from 'react';
import Icon from '@/components/universals/icon/Icon.component';
import type { TIcon } from '@/components/universals/icon/Icon.type';
import styles from './tile-list-item.module.scss';

type TileListItemProps = {
  name: string;
  backgroundImage?: string;
  icon?: TIcon;
  transparent?: boolean;
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
};

const TileListItem: React.FunctionComponent<TileListItemProps> = ({
  name,
  backgroundImage,
  icon,
  transparent,
  onContextMenu,
}) => {
  return (
    <div
      className={clsx(styles.root, transparent && styles.rootTransparent)}
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
      }}
      onContextMenu={onContextMenu}
    >
      {icon ? (
        <div className={styles.icon}>
          <Icon icon={icon} />
        </div>
      ) : null}
      <div className={styles.name}>{name}</div>
    </div>
  );
};

export default TileListItem;
