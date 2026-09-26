import type React from 'react';
import IconButton, {
  type IconButtonProps,
} from '@/components/universals/forms/button/IconButton';
import LoadingActionButtonBase, {
  type LoadingButtonBaseProps,
} from '@/components/universals/forms/button/LoadingActionButtonBase';

type IconLoadingButtonProps = Omit<IconButtonProps, 'onClick'> &
  Pick<LoadingButtonBaseProps, 'onClick'>;

const IconActionButton: React.FunctionComponent<IconLoadingButtonProps> = ({
  onClick,
  disabled,
  ...props
}) => {
  return (
    <LoadingActionButtonBase onClick={onClick} disabled={disabled}>
      {(loaderProps) => <IconButton {...props} {...loaderProps} />}
    </LoadingActionButtonBase>
  );
};

export default IconActionButton;
