import { createContext, useContext } from 'react';

// Von DialogProviderDialog gesetzt (aus der color-Option von openDialog),
// von Dialog (dialog.component.tsx) gelesen, um die Overlay-Hintergrundfarbe
// für den aktuell offenen Dialog zu überschreiben. undefined -> Standardfarbe
// aus dialog.module.scss.
export const DialogOverlayColorContext = createContext<string | undefined>(undefined);

export const useDialogOverlayColor = () => useContext(DialogOverlayColorContext);
