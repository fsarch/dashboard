'use client';

import React, { useCallback } from 'react';
import FloatingButton from "@/components/universals/floating-button/FloatingButton";
import type { AppFloatingButton } from "@/constants/app.type";
import { useFloatingButtonProvider } from "@/components/universals/floating-button/FloatingButtonProvider.context";

type AutoFloatingButtonProps = {
  floatingButton?: AppFloatingButton;
};

export const AutoFloatingButton: React.FunctionComponent<AutoFloatingButtonProps> = ({
  floatingButton,
}) => {
  const { triggerClick } = useFloatingButtonProvider();

  const handleClick = useCallback(() => {
    if (!floatingButton) {
      return;
    }

    triggerClick(floatingButton.id);
  }, [triggerClick, floatingButton]);

  if (!floatingButton) {
    return null;
  }

  return (
    <FloatingButton
      icon={floatingButton.icon ?? 'circle'}
      onClick={handleClick}
    />
  );
};
