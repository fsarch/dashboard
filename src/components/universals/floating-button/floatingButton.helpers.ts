import type { AppFloatingButton } from '@/constants/app.type';

// Isomorphic on purpose (no next/headers import) - used both server-side by
// DefaultPage and client-side by AutoFloatingButton.
export const normalizeFloatingButtons = (
  floatingButton?: AppFloatingButton | Array<AppFloatingButton>,
): Array<AppFloatingButton> => {
  if (!floatingButton) {
    return [];
  }

  return Array.isArray(floatingButton) ? floatingButton : [floatingButton];
};
