import React, { PropsWithChildren } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import styles from './LinkCard.module.scss';

type LinkCardProps = PropsWithChildren<{
  href?: string;
  // Alternative zu href: für Karten, die keine Navigation auslösen, sondern
  // z. B. einen Dialog öffnen (siehe CustomResourcePickerInput).
  onClick?: () => void;
  // Default faChevronRight (Navigations-Andeutung); Aufrufer wie der
  // Custom-Resource-Picker geben stattdessen z. B. faPen, um "bearbeiten/
  // auswählen" statt "weiter zu einer anderen Seite" auszudrücken.
  icon?: IconDefinition;
  className?: string;
}>;

const LinkCard: React.FunctionComponent<LinkCardProps> = ({
  href,
  onClick,
  icon = faChevronRight,
  className,
  children,
}) => {
  if (href) {
    return (
      <Link href={href} className={clsx(styles.root, className)}>
        <span className={styles.content}>{children}</span>
        <FontAwesomeIcon icon={icon} className={styles.chevron} />
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={clsx(styles.root, styles.button, className)}>
        <span className={styles.content}>{children}</span>
        <FontAwesomeIcon icon={icon} className={styles.chevron} />
      </button>
    );
  }

  return <div className={clsx(styles.root, className)}>{children}</div>;
};

export default LinkCard;

