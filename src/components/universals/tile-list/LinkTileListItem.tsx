import React from 'react';

import styles from './link-tile-list-item.module.scss';
import Icon from "@/components/universals/icon/Icon.component";
import { TIcon } from "@/components/universals/icon/Icon.type";
import Link from "next/link";
import clsx from "clsx";

type LinkTileListItemProps = {
  name: string;
  backgroundImage?: string;
  icon?: TIcon;
  href: string;
  small?: boolean;
};

const LinkTileListItem: React.FunctionComponent<LinkTileListItemProps> = ({
  name,
  backgroundImage,
  icon,
  href,
  small,
}) => {
  return (
    <Link
      href={href}
      className={clsx(styles.root, small && styles.rootSmall)}
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
    </Link>
  );
};

export default LinkTileListItem;
