import clsx from 'clsx';
import Link from 'next/link';
import type React from 'react';
import Icon from '@/components/universals/icon/Icon.component';
import type { TIcon } from '@/components/universals/icon/Icon.type';
import styles from './link-tile-list-item.module.scss';

type LinkTileListItemProps = {
  name: string;
  backgroundImage?: string;
  icon?: TIcon;
  image?: string;
  href: string;
  small?: boolean;
  transparent?: boolean;
  onContextMenu?: React.MouseEventHandler<HTMLAnchorElement>;
};

const LinkTileListItem: React.FunctionComponent<LinkTileListItemProps> = ({
  name,
  backgroundImage,
  icon,
  image,
  href,
  small,
  transparent,
  onContextMenu,
}) => {
  return (
    <Link
      href={href}
      className={clsx(
        styles.root,
        small && styles.rootSmall,
        transparent && styles.rootTransparent,
      )}
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
      {!icon && image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.image} src={image} alt="" />
      ) : null}
      <div className={styles.name}>{name}</div>
    </Link>
  );
};

export default LinkTileListItem;
