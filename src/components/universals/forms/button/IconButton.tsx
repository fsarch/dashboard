import type React from 'react';
import Button, { type ButtonProps } from '@/components/universals/forms/Button';
import IconButtonContent from '@/components/universals/forms/button/IconButtonContent';
import type { TIcon } from '@/components/universals/icon/Icon.type';

export type IconButtonProps = ButtonProps & {
  icon: TIcon;
};

const IconButton: React.FunctionComponent<IconButtonProps> = ({
  icon,
  children,
  ...props
}) => {
  return (
    <Button {...props}>
      <IconButtonContent icon={icon}>{children}</IconButtonContent>
    </Button>
  );
};

export default IconButton;
