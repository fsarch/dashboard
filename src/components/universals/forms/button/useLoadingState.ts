import { useCallback, useState } from "react";

export function useLoadingState<TArgs extends Array<unknown>, TReturn>(
  cb: (...args: TArgs) => Promise<TReturn>,
): [boolean, (...args: TArgs) => Promise<TReturn>] {
  const [isLoading, setIsLoading] = useState(false);

  const handleExecuteCallback = useCallback(async (...args: TArgs) => {
    try {
      setIsLoading(true);
      return await cb(...args);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, cb]);

  return [isLoading, handleExecuteCallback];
}
