import React, { MouseEvent, useCallback, useState } from 'react';
import InlineLoadingWrapper from "@/components/universals/forms/button/InlineLoadingWrapper";

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
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async (event: MouseEvent<HTMLButtonElement>) => {
    try {
      setIsLoading(true);
      await onClick(event);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, onClick]);

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
