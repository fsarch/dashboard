import React, { PropsWithChildren } from 'react';
import Link from "next/link";
import styles from './AutoNavigationItem.module.scss';

type AutoNavigationItemProps = PropsWithChildren<{
  href: string;
}>;

const AutoNavigationItem: React.FunctionComponent<AutoNavigationItemProps> = ({
  children,
  href,
}) => {
  return (
    <li
      className={styles.root}
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
