import React from "react";

export type TContextMenuComponent<TInput> = React.FC<{
  value: TInput;
  close: () => void;
}>;

// Returned by useOpenContextMenu() - no result Promise (unlike TDialog) since
// context-menu items trigger their own action and close themselves; kept as
// an object so a `result` field could be added later without breaking callers.
export type TContextMenu = {
  id: string;
  close: () => void;
};
