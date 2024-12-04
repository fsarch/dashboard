import { createContext, PropsWithChildren, useContext } from "react";

export type DataTableUpdateFunc = (identifiers: { key: string; object: Record<string, unknown> }, field: string, value: unknown) => void;

const DataTableUpdateContext = createContext<DataTableUpdateFunc>(() => {});

export const DataTableUpdateContextProvider: React.FC<PropsWithChildren<{
  onUpdate: DataTableUpdateFunc;
}>> = ({
  onUpdate,
  children,
}) => {
  return (
    <DataTableUpdateContext.Provider value={onUpdate}>
      {children}
    </DataTableUpdateContext.Provider>
  )
}

export const useDataTableUpdateContext = () => useContext(DataTableUpdateContext);
