import React, { useContext } from "react";

export type TNestedFormContext = {
  path: Array<string | number>;
};

const NestedFormContext = React.createContext<TNestedFormContext>({
  path: [],
});

export const NestedFormContextProvider = NestedFormContext.Provider;

export const useNestedFormContext = () => useContext(NestedFormContext);
