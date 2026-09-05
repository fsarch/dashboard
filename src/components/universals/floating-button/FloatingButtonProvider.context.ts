import { createContext, useContext, useEffect, useRef } from "react";

export type TFloatingButtonListener = () => void;

export type TFloatingButtonProviderContext = {
  registerListener: (id: string, listener: TFloatingButtonListener) => () => void;
  triggerClick: (id: string) => void;
};

export const FloatingButtonProviderContext = createContext<TFloatingButtonProviderContext>({
  registerListener: () => () => {},
  triggerClick: () => {},
});

export const useFloatingButtonProvider = () => useContext(FloatingButtonProviderContext);

// Registers `listener` to run whenever the floating button configured with
// the given `id` (see AppFloatingButton in src/constants/app.type.ts) is
// clicked. The button itself can be rendered anywhere in the tree (it lives
// in DefaultPage) - this hook is how a page/component supplies the actual
// click behaviour for it.
export const useFloatingButtonClick = (id: string, listener: TFloatingButtonListener) => {
  const { registerListener } = useFloatingButtonProvider();

  // keep the latest listener without having to re-register on every render
  const listenerRef = useRef(listener);
  listenerRef.current = listener;

  useEffect(() => {
    return registerListener(id, () => listenerRef.current());
  }, [id, registerListener]);
};
