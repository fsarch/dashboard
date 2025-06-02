import { createContext, useCallback, useContext } from "react";
import { LoadingProviderContextType } from "@/components/universals/loader/LoadingProvider.type";

export const LoadingProviderContext = createContext<LoadingProviderContextType>({
  showLoading: () => ({ close: () => {} }),
});
export const useLoading = () => useContext(LoadingProviderContext);
export const useWithLoading = (): <T>(cb: () => Promise<T>, text?: string) => Promise<T> => {
  const loading = useLoading();

  return useCallback(async <T>(cb: () => Promise<T>, text?: string): Promise<T> => {
    const loader = loading.showLoading(text);

    try {
      return await cb();
    } finally {
      loader.close();
    }
  }, [loading]);
}
