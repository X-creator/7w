import { useContext } from "react";
import { StoreContext } from "./store-context.ts";

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) throw new Error("Store has to be used within <StoreProvider>.");

  return store;
};
