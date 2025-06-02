'use client';

import React, { PropsWithChildren, useEffect, useRef } from 'react';
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
  const liRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (!isSelected) {
      return;
    }

    if (!liRef.current) {
      return;
    }

    const isMobile = window.matchMedia("(max-width: 800px)");
    if (!isMobile) {
      return;
    }

    liRef.current.scrollIntoView(true);
  }, [isSelected]);

  return (
    <li
      ref={liRef}
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
