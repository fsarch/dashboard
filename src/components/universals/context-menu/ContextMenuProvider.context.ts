import { createContext, useCallback, useContext } from "react";
import { TContextMenu, TContextMenuComponent } from "@/components/universals/context-menu/contextMenu.type";

export type TContextMenuProviderContext = {
  openContextMenu: (
    component: TContextMenuComponent<unknown>,
    value: unknown,
    event: React.MouseEvent,
  ) => TContextMenu;
};

export const ContextMenuProviderContext = createContext<TContextMenuProviderContext>({
  openContextMenu: () => ({ id: '', close: () => {} }),
});

export const useContextMenu = () => useContext(ContextMenuProviderContext);

// Opens `component` as a context menu anchored at the triggering event's
// cursor position, e.g. wired to an onContextMenu prop:
//   onContextMenu={(e) => openContextMenu(MyMenu, { item }, e)}
export const useOpenContextMenu = () => {
  const { openContextMenu } = useContextMenu();

  return useCallback(<TInput,>(
    component: TContextMenuComponent<TInput>,
    value: TInput,
    event: React.MouseEvent,
  ): TContextMenu => {
    event.preventDefault();

    return openContextMenu(
      component as TContextMenuComponent<unknown>,
      value,
      event,
    );
  }, [openContextMenu]);
};
