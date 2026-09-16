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
  // 'standalone' (Default): eigene Umrandung/Radius/Hintergrund, wie bisher.
  // 'segment': ohne eigene Umrandung/Hintergrund - für mehrere LinkCards, die
  // gemeinsam wie eine Karte wirken sollen (siehe LinkCardGroup). Die
  // Segment-Trennung ist dabei nur beim Hover sichtbar (unterschiedlicher
  // Hover-Hintergrund je Segment), im Ruhezustand nicht.
  variant?: 'standalone' | 'segment';
  // Rendert die Karte unabhängig von href/onClick als nicht interaktives,
  // abgeblendetes Element (Icon/Content bleiben sichtbar) - z. B. für den
  // Sprung-Chevron, solange dessen Ziel noch lädt oder gar nicht existiert:
  // die Karte soll trotzdem immer an derselben Stelle stehen, wie der Stift
  // daneben (siehe CustomResourcePickerInput), statt ein-/auszublenden.
  disabled?: boolean;
}>;

const LinkCard: React.FunctionComponent<LinkCardProps> = ({
  href,
  onClick,
  icon = faChevronRight,
  className,
  variant = 'standalone',
  disabled = false,
  children,
}) => {
  const rootClassName = clsx(styles.root, variant === 'segment' && styles.segment, disabled && styles.disabled, className);
  // Ohne children (z. B. der reine Sprung-Chevron neben einer anderen
  // LinkCard) keinen (leeren) content-Span rendern - sonst zieht dessen
  // gap zum Icon unnötigen Leerraum vor das Icon.
  const content = children != null ? <span className={styles.content}>{children}</span> : null;

  if (!disabled && href) {
    return (
      <Link href={href} className={rootClassName}>
        {content}
        <FontAwesomeIcon icon={icon} className={styles.chevron} />
      </Link>
    );
  }

  if (!disabled && onClick) {
    return (
      <button type="button" onClick={onClick} className={clsx(rootClassName, styles.button)}>
        {content}
        <FontAwesomeIcon icon={icon} className={styles.chevron} />
      </button>
    );
  }

  return (
    <div className={rootClassName}>
      {content}
      <FontAwesomeIcon icon={icon} className={styles.chevron} />
    </div>
  );
};

export default LinkCard;

// Gemeinsame Umrandung/Hintergrund für mehrere LinkCard-Segmente (variant
// 'segment'), die zusammen optisch wie eine einzelne Karte wirken sollen
// (siehe CustomResourcePickerInput: Stift- und Sprung-Aktion in einer Karte).
export const LinkCardGroup: React.FunctionComponent<PropsWithChildren<{ className?: string }>> = ({
  className,
  children,
}) => (
  <div className={clsx(styles.group, className)}>{children}</div>
);
