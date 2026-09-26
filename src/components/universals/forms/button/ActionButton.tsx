import type React from 'react';
import Button, { type ButtonProps } from '@/components/universals/forms/Button';
import LoadingActionButtonBase, {
  type LoadingButtonBaseProps,
} from '@/components/universals/forms/button/LoadingActionButtonBase';

type LoadingButtonProps = Omit<ButtonProps, 'onClick'> &
  Pick<LoadingButtonBaseProps, 'onClick'>;

const ActionButton: React.FunctionComponent<LoadingButtonProps> = ({
  onClick,
  disabled,
  ...props
}) => {
  return (
    <LoadingActionButtonBase onClick={onClick} disabled={disabled}>
      {(loaderProps) => <Button {...props} {...loaderProps} />}
    </LoadingActionButtonBase>
  );
};

export default ActionButton;
