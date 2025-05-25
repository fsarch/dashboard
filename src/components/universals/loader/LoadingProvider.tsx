'use client';

import React, { PropsWithChildren, useMemo, useState } from 'react';
import LoadingPage from "@/components/universals/loader/LoadingPage";
import { LoadingProviderContext } from "@/components/universals/loader/LoadingProvider.context";
import { LoadingProviderContextType } from "@/components/universals/loader/LoadingProvider.type";

type LoadingProviderProps = PropsWithChildren<{

}>;

const LoadingProvider: React.FunctionComponent<LoadingProviderProps> = ({
  children,
}) => {
  const [loadingText, setLoadingText] = useState<string | null>(null);

  const loadingProviderValue = useMemo((): LoadingProviderContextType => ({
    showLoading: (text = 'Lade Daten...') => {
      console.log('show');
      setLoadingText(text);

      return {
        close: () => {
          console.log('close')
          setLoadingText(null);
        },
      };
    }
  }), [setLoadingText]);

  return (
    <LoadingProviderContext.Provider value={loadingProviderValue}>
      {children}
      {loadingText ? (
        <LoadingPage
          text={loadingText}
        />
      ) : null}
    </LoadingProviderContext.Provider>
  );
};

export default LoadingProvider;
