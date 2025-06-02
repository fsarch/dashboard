'use client';

import React, { PropsWithChildren, useEffect, useRef } from 'react';
import Link from "next/link";
import styles from './AutoNavigationItem.module.scss';
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TIcon } from "@/components/universals/icon/Icon.type";
import Icon from "@/components/universals/icon/Icon.component";

type AutoNavigationItemProps = PropsWithChildren<{
  href: string;
  isSelected?: boolean;
  icon?: TIcon;
}>;

const AutoNavigationItem: React.FunctionComponent<AutoNavigationItemProps> = ({
  children,
  isSelected,
  href,
  icon,
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

  console.log('icon', icon);

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
        {icon ? (
          <Icon
            className={styles.icon}
            icon={icon}
          />
        ) : null}
        {children}
      </Link>
    </li>
  );
};

export default AutoNavigationItem;
