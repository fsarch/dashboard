import { TIcon } from "@/components/universals/icon/Icon.type";

export type CommandCenterDefinitionType = {
  $type: 'section';
  label: string;
  items: Array<{
    label: string;
    href: string;
    icon: TIcon;
  }>;
};
