import React from 'react';
import Button, { ButtonProps } from "@/components/universals/forms/Button";
import { TIcon } from "@/components/universals/icon/Icon.type";
import IconButtonContent from "@/components/universals/forms/button/IconButtonContent";

export type IconButtonProps = ButtonProps & {
  icon: TIcon;
};

const IconButton: React.FunctionComponent<IconButtonProps> = ({
  icon,
  children,
  ...props
}) => {
  return (
    <Button
      {...props}
    >
      <IconButtonContent icon={icon}>
        {children}
      </IconButtonContent>
    </Button>
  );
};

export default IconButton;
