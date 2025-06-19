import React, { MouseEvent } from 'react';
import InlineLoadingWrapper from "@/components/universals/forms/button/InlineLoadingWrapper";
import { useLoadingState } from "@/components/universals/forms/button/useLoadingState";

export type LoadingButtonBaseProps = {
  onClick: (event: MouseEvent<HTMLButtonElement>) => Promise<void>;
  disabled?: boolean;
  children: (props: {
    onClick: (event: MouseEvent<HTMLButtonElement>) => Promise<void>;
    disabled: boolean;
  }) => React.ReactElement;
};

const LoadingActionButtonBase: React.FunctionComponent<LoadingButtonBaseProps> = ({
  onClick,
  disabled,
  children,
}) => {
  const [isLoading, handleClick] = useLoadingState(onClick);

  return (
    <InlineLoadingWrapper
      isLoading={isLoading}
    >
      {children({
        onClick: handleClick,
        disabled: isLoading || disabled || false,
      })}
    </InlineLoadingWrapper>
  );
};

export default LoadingActionButtonBase;
