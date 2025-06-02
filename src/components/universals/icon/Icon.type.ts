import { IconName } from "@fortawesome/fontawesome-svg-core";

export type TIcon = {
  $type: 'layers',
  icons: Array<{
    $type: 'fa-icon';
    icon: IconName;
    transform?: string;
    color?: string;
  }>;
} | IconName;
