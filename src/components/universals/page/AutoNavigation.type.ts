import type { TIcon } from "@/components/universals/icon/Icon.type";

export type AutoNavigationItemType = {
  name: string;
  path: string;
  isSelected: boolean;
  icon?: TIcon;
};
