import React, { PropsWithChildren } from 'react';
import Link from "next/link";
import styles from './AutoNavigationItem.module.scss';
import clsx from "clsx";

type AutoNavigationItemProps = PropsWithChildren<{
  href: string;
  isSelected?: boolean;
}>;

const AutoNavigationItem: React.FunctionComponent<AutoNavigationItemProps> = ({
  children,
  isSelected,
  href,
}) => {
  return (
    <li
      className={clsx(styles.root, {
        [styles.selected]: isSelected,
      })}
    >
      <Link
        href={href}
        className={styles.link}
      >
        {children}
      </Link>
    </li>
  );
};

export default AutoNavigationItem;
