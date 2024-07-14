import { ReactNode } from "react";
import { StoreContext } from "./store-context.ts";
import { store } from "store";

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => (
  <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
);
