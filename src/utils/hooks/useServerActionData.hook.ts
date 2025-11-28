import { useEffect, useState } from "react";

export function useServerActionData<TArgs extends Array<unknown>, TReturn>(
  serverAction: (...args: TArgs) => Promise<TReturn>,
  args: TArgs,
): {
  data: TReturn;
  isLoading: boolean;
} {
  const [value, setValue] = useState<TReturn | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      try {
        const data = await serverAction(...args);

        setValue(data);
      } catch (error) {
        setIsLoading(false);
        setValue(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [setIsLoading, setValue]);

  return {
    data: value as TReturn,
    isLoading,
  };
}
