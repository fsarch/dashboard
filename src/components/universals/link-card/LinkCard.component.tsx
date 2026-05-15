import React, { PropsWithChildren } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from './LinkCard.module.scss';

type LinkCardProps = PropsWithChildren<{
  href?: string;
  className?: string;
}>;

const LinkCard: React.FunctionComponent<LinkCardProps> = ({
  href,
  className,
  children,
}) => {
  if (href) {
    return (
      <Link href={href} className={clsx(styles.root, className)}>
        <span className={styles.content}>{children}</span>
        <FontAwesomeIcon icon={faChevronRight} className={styles.chevron} />
      </Link>
    );
  }

  return <div className={clsx(styles.root, className)}>{children}</div>;
};

export default LinkCard;

