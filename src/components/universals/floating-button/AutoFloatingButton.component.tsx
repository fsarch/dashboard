'use client';

import React, { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import FloatingButton from "@/components/universals/floating-button/FloatingButton";
import type { AppFloatingButton } from "@/constants/app.type";
import { useFloatingButtonProvider } from "@/components/universals/floating-button/FloatingButtonProvider.context";
import { normalizeFloatingButtons } from "@/components/universals/floating-button/floatingButton.helpers";
import styles from './AutoFloatingButton.module.scss';

type AutoFloatingButtonProps = {
  floatingButton?: AppFloatingButton | Array<AppFloatingButton>;
};

export const AutoFloatingButton: React.FunctionComponent<AutoFloatingButtonProps> = ({
  floatingButton,
}) => {
  const { triggerClick } = useFloatingButtonProvider();
  const [expanded, setExpanded] = useState(false);

  const buttons = useMemo(() => normalizeFloatingButtons(floatingButton), [floatingButton]);

  const handleToggle = useCallback(() => {
    setExpanded((current) => !current);
  }, []);

  const handleItemClick = useCallback((id: string) => {
    setExpanded(false);
    triggerClick(id);
  }, [triggerClick]);

  if (buttons.length === 0) {
    return null;
  }

  // A single button acts directly on click - no +/x expand/collapse.
  if (buttons.length === 1) {
    return (
      <FloatingButton
        icon={buttons[0].icon ?? 'circle'}
        onClick={() => triggerClick(buttons[0].id)}
      />
    );
  }

  // Rendered bottom-to-top, first entry closest to the toggle button.
  const stackedButtons = [...buttons].reverse();

  return (
    <div className={clsx(styles.container, expanded && styles.expanded)}>
      {stackedButtons.map((button, index) => {
        const distanceFromToggle = stackedButtons.length - 1 - index;

        return (
          <div
            key={button.id}
            className={styles.item}
            style={{ transitionDelay: `${(expanded ? distanceFromToggle : index) * 40}ms` }}
          >
            {button.title ? <span className={styles.itemLabel}>{button.title}</span> : null}
            <FloatingButton
              size="small"
              style={{ position: 'static' }}
              icon={button.icon ?? 'circle'}
              onClick={() => handleItemClick(button.id)}
            />
          </div>
        );
      })}
      <FloatingButton
        className={styles.toggle}
        // Longer than FloatingButton's own default transition duration, so
        // the extra full turn (see .expanded .toggle) is actually visible
        // instead of snapping through it - inline wins regardless of CSS
        // module load order (see FloatingButton.module.scss for why that
        // matters here).
        style={{ position: 'static', transitionDuration: '0.4s' }}
        icon="plus"
        onClick={handleToggle}
      />
    </div>
  );
};
