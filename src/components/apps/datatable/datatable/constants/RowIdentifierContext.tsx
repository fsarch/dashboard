import { createContext, PropsWithChildren, useContext, useMemo } from "react";

export type RowIdentifierContextType = {
  identificationKey: string;
  identifiers: Record<string, unknown>;
}

const RowIdentifierContext = createContext<RowIdentifierContextType>({
  identificationKey: '',
  identifiers: {},
});

export const RowIdentifierContextProvider: React.FC<PropsWithChildren<RowIdentifierContextType>> = ({
  identificationKey,
  identifiers,
  children,
}) => {
  const data = useMemo(() => ({
    identificationKey,
    identifiers,
  }), [identificationKey, identifiers]);

  return (
    <RowIdentifierContext.Provider value={data}>
      {children}
    </RowIdentifierContext.Provider>
  )
}

export const useRowIdentifierContext = () => useContext(RowIdentifierContext);
