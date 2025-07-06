import React from 'react';
import LoadingActionButtonBase, {
  LoadingButtonBaseProps
} from "@/components/universals/forms/button/LoadingActionButtonBase";
import Button, { ButtonProps } from "@/components/universals/forms/Button";

type LoadingButtonProps = Omit<ButtonProps, 'onClick'> & Pick<LoadingButtonBaseProps, 'onClick'>;

const ActionButton: React.FunctionComponent<LoadingButtonProps> = ({
  onClick,
  disabled,
  ...props
}) => {
  return (
    <LoadingActionButtonBase
      onClick={onClick}
      disabled={disabled}
    >
      {(loaderProps) => (
        <Button
          {...props}
          {...loaderProps}
        />
      )}
    </LoadingActionButtonBase>
  );
};

export default ActionButton;
